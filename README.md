# Rajdhani Yuva Sansad - Official Website

Rajdhani Yuva Sansad (RYS) is a youth-focused organization founded in 2017 in New Delhi. The platform presents RYS initiatives, conference archives, upcoming registrations, and contact channels.

## Live Domain

- Production domain: `https://rajdhaniyuvasansad.com`

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- GitHub Pages deployment (GitHub Actions workflow)

This is a static website with no backend and no build step.

## Current Structure

```text
rys_final_git/
|- index.html                    # Home page
|- about/index.html
|- conferences/index.html
|- conferences/<event>/index.html
|- contact/index.html
|- upcoming/index.html
|- css/
|- js/
|- images/
|- booklets_comp/
|- sitemap.xml
|- robots.txt
|- 404.html
|- .github/workflows/deploy.yml
```

## SEO and Hosting Files

The repository includes:

- `sitemap.xml` (main routes + conference detail routes)
- `robots.txt` (crawl allow + sitemap reference)
- `404.html` (custom not-found page)

If domain changes, update:

1. all `<loc>` entries inside `sitemap.xml`
2. `Sitemap:` line inside `robots.txt`

## Run Locally

Option 1 (direct open):

- Open `index.html` in browser

Option 2 (local server, recommended):

```bash
python -m http.server 8080
```

Then open:

- `http://localhost:8080/`

## Deploy

Deployment workflow is configured in:

- `.github/workflows/deploy.yml`

Push to `main` to trigger GitHub Pages deployment.

## Manual Post-Deploy Steps

1. Add and verify site in Google Search Console
2. Submit `https://rajdhaniyuvasansad.com/sitemap.xml`
3. Connect GA4 property
4. Ensure HTTPS certificate is active at domain/hosting layer

## Contributing

Please read `.github/CONTRIBUTING.md` before opening pull requests.

## License

MIT License. See `LICENSE`.

Copyright (c) 2017-2026 Rajdhani Yuva Sansad.