# Contributing to the RYS Website

Thank you for your interest in contributing! Follow the guidelines below to keep things clean.

---

## Getting Started

1. **Fork** the repository and clone your fork locally.
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Open a **Pull Request** against `main` with a clear description.

---

## Code Style

- **HTML**: Use semantic tags; keep indentation at 2 spaces.
- **CSS**: Add new rules at the bottom of the relevant file; use existing CSS custom properties (e.g. `--saffron`, `--gold`) instead of hard-coded colours.
- **JS**: Vanilla JS only — no frameworks. Keep functions small and clearly named.
- Images should be compressed before committing (use TinyPNG or similar).

---

## Reporting Issues

Use the GitHub Issues tab. Include:
- Browser and OS
- Steps to reproduce
- Screenshot if relevant

---

## Adding a New Conference Page

1. Copy an existing conference folder (e.g. `conferences/nlpf_2024/`) and rename it.
2. Update all text, dates, and image paths inside the copied `index.html`.
3. Add a card for the new conference in `conferences/index.html`.
4. Place images in `rys-images/conferences/<your_conference_folder>/`.

---

## Pull Request Checklist

- [ ] No `desktop.ini`, `.DS_Store`, or other OS files committed
- [ ] Images compressed
- [ ] Pages tested in Chrome and Firefox
- [ ] No broken links or missing image paths
