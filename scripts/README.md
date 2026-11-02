# Website image assets

Original JPG/PNG photographs in `images/` are retained. Pages serve WebP
derivatives from `images/optimized/` instead. Each filename contains a hash of
its source and encoding settings so it can be cached immutably.

After adding a new original image and referencing it in a page, run:

```sh
python -m pip install -r scripts/requirements-images.txt
python scripts/optimize_images.py
```

Commit the new variants, manifest, and updated page references together.
The optimizer preserves image proportions and EXIF orientation, generates
480/960/1600-pixel-wide variants without upscaling, and adds native responsive
image selection. Hero images load eagerly; images further down the page load
lazily. Galleries use thumbnails and request their 1600-pixel variant when
opened in the lightbox. No build service or image-optimization subscription
is required, so the same assets work on Vercel and GitHub Pages.

The optimizer also runs `prepare_home_images.py` to build 240-pixel portrait
thumbnails and tiny inline photo previews for the home page. These dynamic
image sources live in `home-image-sources.json`; their generated responsive
metadata is served from `js/home-image-data.js`. The home controller preloads
nearby sections, loads a tab's portraits on interaction, and waits for the next
carousel image to decode before changing slides. This keeps photo cards and
slides visible on slower connections without eagerly fetching the whole archive.

To run the home-image regression check against a running local server, install
Playwright (`python -m pip install playwright`) and run:

```sh
python scripts/check_home_images.py
```

It checks every carousel slide and dignitary tab on desktop and mobile, including
an artificial three-second image delay. Windows uses the installed Edge browser;
on other systems install Chromium with `python -m playwright install chromium`.

GitHub Actions runs `prepare_pages.py` to stage tracked site files into `dist/`
and prefix local routes, `srcset` URLs, and script/image paths with the repository
name for project Pages hosting. Production source paths stay unchanged for the
custom domain on Vercel. To check this locally after staging changes in Git:

```sh
python scripts/prepare_pages.py --base-path /rys_final_git/
```
