# Rajdhani Yuva Sansad — Official Website

**Rajdhani Yuva Sansad (RYS)** is a youth-centric organisation founded in 2017 by two law students in New Delhi. We empower young minds through Model United Nations (MUN), Youth Parliaments, and policy-driven dialogue grounded in the Constitution of India.

---

## Live Site

> Hosted via GitHub Pages — link will be available after deployment.

---

## Project Structure

```
rys_final_git/
├── home/               # Landing page
├── about/              # About RYS page
├── conferences/        # All conferences index + individual detail pages
├── contact/            # Contact page
├── css/                # Shared and page-specific stylesheets
├── js/                 # Shared and page-specific scripts
├── rys-images/         # All image assets (organised by section)
├── booklets_comp/      # Compressed conference booklets (PDF)
├── rys-logo.png        # Site logo
└── index.html          # Root redirect (if present)
```

---

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, responsive layouts
- **Vanilla JavaScript** — no frameworks or build tools
- **Google Fonts** — Cinzel, Mulish, IM Fell English, Playwrite IE

This is a fully **static site** — no server, no database, no build step required.

---

## Running Locally

Since this is a plain static site, you can open it directly in a browser or serve it with any static file server:

```bash
# Option 1 — open directly
start home/index.html       # Windows
open home/index.html        # macOS

# Option 2 — VS Code Live Server extension
# Right-click home/index.html → "Open with Live Server"

# Option 3 — Python
python -m http.server 8080
# then visit http://localhost:8080/home/
```

---

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/home/`.

---

## Contributing

Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) before opening pull requests.

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

© 2017–2026 Rajdhani Yuva Sansad. All rights reserved.
