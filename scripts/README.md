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

GitHub Actions runs `prepare_pages.py` to stage tracked site files into `dist/`
and prefix local routes, `srcset` URLs, and script/image paths with the repository
name for project Pages hosting. Production source paths stay unchanged for the
custom domain on Vercel. To check this locally after staging changes in Git:

```sh
python scripts/prepare_pages.py --base-path /rys_final_git/
```
