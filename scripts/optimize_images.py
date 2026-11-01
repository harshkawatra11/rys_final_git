"""Create cached WebP variants and update the static site's image references.

Run with Python 3 and Pillow: python scripts/optimize_images.py
Original photographs remain untouched. The manifest makes subsequent runs incremental.
"""
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import argparse
import json
import re

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "optimized"
MANIFEST = OUT / "manifest.json"
WIDTHS = (480, 960, 1600)
SOURCE_RE = re.compile(r"/images/([A-Za-z0-9_.-]+\.(?:jpe?g|png))", re.I)
VOID = set("area base br col embed hr img input link meta param source track wbr".split())


def generate(path, cached=None):
    original = path.read_bytes()
    digest = sha256(original + b"rys-webp-v1-q82").hexdigest()[:12]
    if cached and all(digest in v["url"] and (ROOT / v["url"].lstrip("/")).is_file()
                      and (ROOT / v["url"].lstrip("/")).stat().st_size > 0 for v in cached["variants"]):
        return path.name, cached
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        width, height = image.size
        variants = []
        for target in sorted(set(min(w, width) for w in WIDTHS)):
            dest = OUT / f"{path.stem}-{digest}-{target}w.webp"
            if not dest.exists() or not dest.stat().st_size:
                resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
                temp = dest.with_suffix(".tmp")
                resized.save(temp, "WEBP", quality=82, method=6)
                temp.replace(dest)
            variants.append({"width": target, "url": "/" + dest.relative_to(ROOT).as_posix(), "bytes": dest.stat().st_size})
        return path.name, {"width": width, "height": height, "original_bytes": len(original), "variants": variants}


class ImageTags(HTMLParser):
    """Locate image tags without reformatting official prose or inline scripts."""
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.offsets = [0]
        for line in source.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.stack = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        props = dict(attrs)
        if tag == "img":
            row, col = self.getpos()
            contexts = " ".join(x[1] for x in self.stack)
            self.images.append((self.offsets[row-1]+col, self.get_starttag_text(), props, contexts))
        if tag not in VOID:
            self.stack.append((tag, props.get("class", "") + " " + props.get("id", "")))

    def handle_startendtag(self, tag, attrs):
        if tag == "img":
            self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break


def attr(tag, key, value):
    pattern = re.compile(r"\s" + re.escape(key) + r"\s*=\s*([\"']).*?\1", re.S)
    addition = ' ' + key + '="' + escape(str(value), quote=True) + '"'
    if pattern.search(tag):
        return pattern.sub(lambda _: addition, tag, count=1)
    return re.sub(r"\s*/?>$", lambda m: addition + m.group(), tag, count=1)


def improve_html(source, manifest):
    parser = ImageTags(source)
    parser.feed(source)
    patches = []
    priority_set = False
    for start, raw, props, context in parser.images:
        original_length = len(raw)
        src = props.get("src", "")
        if src.startswith("https://"):
            raw = attr(raw, "loading", "eager" if "conf-hero-slide active" in context else "lazy")
            raw = attr(raw, "decoding", "async")
            patches.append((start, original_length, raw))
            continue
        match = SOURCE_RE.fullmatch(src)
        # Optimized tags are left alone on repeat runs.
        if not match or match[1] not in manifest:
            continue
        item = manifest[match[1]]
        variants = item["variants"]
        gallery = "cd-gallery-item" in context
        small = gallery or any(c in context for c in ("h-img-box", "hero-floating-images", "conf-deco-stack", "conf-hero-thumb", "dig-photo"))
        portrait = any(c in context for c in ("team-img", "founder-img-frame", "conf-guest"))
        collage = any(c in context for c in ("uc-hero-mosaic", "ah-mosaic", "ch-filmstrip", "hero-collage", "h-img-box"))
        is_hero = any(c in context.split() for c in ("hero", "about-hero", "conf-hero", "uc-hero", "conf-detail-hero"))
        inactive_slide = "conf-hero-slide" in context and "active" not in context.split()
        hidden = any(c in context for c in ("hero-floating-images", "conf-deco-stack"))
        eager = (is_hero and not inactive_slide and not hidden) or "nav-logo" in context
        if gallery:
            sizes = "(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
        elif "h-img-box" in context:
            sizes = "(max-width: 600px) 50vw, 25vw"
        elif collage:
            sizes = "(max-width: 600px) 100vw, 50vw"
        elif portrait:
            sizes = "(max-width: 600px) 50vw, 25vw"
        elif "logo" in context:
            sizes = "80px"
        elif is_hero:
            sizes = "100vw"
        else:
            sizes = "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 640px"
        default = variants[0] if small else variants[min(1, len(variants)-1)]
        raw = attr(raw, "src", default["url"])
        raw = attr(raw, "srcset", ", ".join(f'{v["url"]} {v["width"]}w' for v in variants))
        raw = attr(raw, "sizes", sizes)
        raw = attr(raw, "loading", "eager" if eager else "lazy")
        raw = attr(raw, "decoding", "async")
        # CSS sizing stays in control; dimensions reserve space during downloads.
        if "width" not in props and "height" not in props:
            raw = attr(raw, "width", item["width"])
            raw = attr(raw, "height", item["height"])
        high = eager and is_hero and not priority_set
        if high:
            priority_set = True
        raw = attr(raw, "fetchpriority", "high" if high else ("low" if not eager else "auto"))
        if gallery:
            raw = attr(raw, "data-full-src", variants[-1]["url"])
            raw = attr(raw, "data-collage-src", variants[0]["url"])
        patches.append((start, original_length, raw))
    for start, length, raw in reversed(patches):
        source = source[:start] + raw + source[start+length:]
    return source


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rewrite-only", action="store_true", help="Reuse the existing manifest without generating assets")
    options = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    previous = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    if options.rewrite_only:
        if not previous:
            parser.error("Generate the image manifest first")
        manifest = previous
    else:
        sources = sorted(p for p in (ROOT / "images").iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png"))
        with ThreadPoolExecutor(max_workers=4) as pool:
            manifest = dict(pool.map(lambda path: generate(path, previous.get(path.name)), sources))
        MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    original_urls = {v["url"]: "/images/" + name for name, item in previous.items() for v in item["variants"]}
    files = [ROOT / "index.html", ROOT / "404.html"]
    for directory in ("about", "contact", "conferences", "upcoming", "css", "js"):
        files.extend(p for p in (ROOT / directory).rglob("*") if p.suffix in (".html", ".css", ".js"))
    def replace_ref(match):
        item = manifest.get(match[1])
        return item["variants"][-1]["url"] if item else match[0]
    for path in files:
        source = path.read_text(encoding="utf-8")
        # Reconnect existing variants to their source so replacing an original
        # automatically updates its hash and all responsive variants next time.
        normalized = re.sub(r"/images/optimized/[A-Za-z0-9_.-]+\.webp", lambda m: original_urls.get(m[0], m[0]), source)
        updated = improve_html(normalized, manifest) if path.suffix == ".html" else normalized
        updated = SOURCE_RE.sub(replace_ref, updated)
        if source != updated:
            path.write_text(updated, encoding="utf-8")
    before = sum(i["original_bytes"] for i in manifest.values())
    after = sum(i["variants"][-1]["bytes"] for i in manifest.values())
    print(f"{len(manifest)} originals preserved; largest web versions: {before/1024**2:.1f} MB -> {after/1024**2:.1f} MB ({100*(1-after/before):.1f}% smaller)")


if __name__ == "__main__":
    main()
