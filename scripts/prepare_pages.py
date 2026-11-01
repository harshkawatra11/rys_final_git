"""Stage the tracked static site with correct GitHub project-page asset paths."""
import argparse
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SITE_DIRS = {"about", "contact", "conferences", "upcoming", "css", "js", "images", "booklets_comp"}
TEXT_TYPES = {".html", ".css", ".js", ".json", ".webmanifest"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-path", default="/")
    args = parser.parse_args()
    base = "/" + args.base_path.strip("/") + "/" if args.base_path.strip("/") else "/"
    output = ROOT / "dist"
    output.mkdir(exist_ok=True)
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
    files = [Path(p) for p in tracked if p and (Path(p).parts[0] in SITE_DIRS or
             (len(Path(p).parts) == 1 and Path(p).suffix in {".html", ".xml", ".txt", ".ico", ".png", ".jpg", ".webmanifest"}))]
    roots = sorted(SITE_DIRS | {p.name for p in files if len(p.parts) == 1})
    # Only rewrite known local paths; absolute external URLs and regexes remain intact.
    matcher = re.compile(r'''(["'\s(,])/(?=(?:''' + "|".join(re.escape(p) for p in roots) + r''')(?:[/#?"'\s)]|$)|["'])''')
    for relative in files:
        source = ROOT / relative
        dest = output / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        if relative.suffix in TEXT_TYPES and base != "/":
            content = source.read_text(encoding="utf-8")
            dest.write_text(matcher.sub(lambda m: m[1] + base, content), encoding="utf-8")
        else:
            shutil.copy2(source, dest)
    (output / ".nojekyll").touch()
    print(f"Staged {len(files)} files for GitHub Pages at {base}")


if __name__ == "__main__":
    main()
