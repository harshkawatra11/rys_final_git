<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,40:7C3AED,100:A855F7&height=200&section=header&text=Rajdhani%20Yuva%20Sansad&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=40" />

<a href="https://rajdhaniyuvasansad.com">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3400&pause=900&color=A855F7&center=true&vCenter=true&width=760&height=50&lines=Official+website+of+Rajdhani+Yuva+Sansad;A+youth-focused+organisation+founded+in+2017;Initiatives+%C2%B7+conference+archives+%C2%B7+registrations;Fast%2C+static%2C+SEO-ready+%E2%80%94+zero+backend" alt="Typing SVG" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/HTML5-1E1B4B?style=for-the-badge&logo=html5&logoColor=E34F26" />
<img src="https://img.shields.io/badge/CSS3-4F46E5?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-6D28D9?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
<img src="https://img.shields.io/badge/GitHub%20Pages-7C3AED?style=for-the-badge&logo=githubpages&logoColor=white" />
<a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-5B21B6?style=for-the-badge" /></a>

<br/>

<a href="https://rajdhaniyuvasansad.com"><img src="https://img.shields.io/badge/▶%20rajdhaniyuvasansad.com-7C3AED?style=for-the-badge&logo=googlechrome&logoColor=white" /></a>

</div>

---

<div align="center">

**Rajdhani Yuva Sansad (RYS) is a youth-focused organisation founded in 2017 in New Delhi. This platform presents RYS initiatives, conference archives, upcoming registrations, and contact channels — as a fast, static, SEO-ready website with no backend and no build step.**

</div>

---

## <img src="https://img.shields.io/badge/-Tech%20Stack-1E1B4B?style=flat-square" height="22"/> &nbsp; Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=html,css,js,github&theme=dark" />

</div>

- **HTML5 · CSS3 · Vanilla JavaScript** — no framework, no build step
- **Google Fonts** for typography
- **GitHub Pages** deployment via a GitHub Actions workflow

---

## <img src="https://img.shields.io/badge/-Structure-1E1B4B?style=flat-square" height="22"/> &nbsp; Project Structure

```text
rys_final_git/
├── index.html                    # Home page
├── about/index.html
├── conferences/index.html
├── conferences/<event>/index.html
├── contact/index.html
├── upcoming/index.html
├── css/  ·  js/  ·  images/  ·  booklets_comp/
├── sitemap.xml  ·  robots.txt  ·  404.html
└── .github/workflows/deploy.yml
```

---

<details>
<summary><b>🚀 Run Locally</b></summary>

<br/>

```bash
# Option 1 — direct: open index.html in a browser

# Option 2 — local server (recommended)
python -m http.server 8080
# then open http://localhost:8080/
```

</details>

<details>
<summary><b>📦 Deploy & SEO</b></summary>

<br/>

Deployment is configured in `.github/workflows/deploy.yml` — push to `main` to trigger GitHub Pages.

The repo includes `sitemap.xml` (main + conference detail routes), `robots.txt` (crawl allow + sitemap reference), and a custom `404.html`. **If the domain changes**, update every `<loc>` in `sitemap.xml` and the `Sitemap:` line in `robots.txt`.

**Manual post-deploy:** verify the site in Google Search Console, submit `https://rajdhaniyuvasansad.com/sitemap.xml`, connect a GA4 property, and ensure the HTTPS certificate is active at the hosting layer.

</details>

---

## License

MIT — see [LICENSE](./LICENSE). &nbsp; Copyright © 2017–2026 Rajdhani Yuva Sansad.

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:A855F7,50:7C3AED,100:4F46E5&height=120&section=footer" />
</div>
