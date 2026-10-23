# Hoang Ngoc Dieu Anh — Portfolio

An editorial, research-led personal portfolio for Hoang Ngoc Dieu Anh, a student at Phu Nhuan High School in Ho Chi Minh City (Class of 2027).

## Creative direction

The redesign follows **A Living Field Journal**: questions, evidence, field notes, and documented moments connect academic research with entrepreneurship, leadership, community work, and creative practice. The experience is intentionally editorial rather than resume-like.

## Technology

The site uses semantic HTML, modern CSS, and dependency-free JavaScript. It requires no package installation or build step. Structured, factual content remains in `dist/content.json`; interactions and dynamic rendering live in `dist/app.js`.

## Local development

Serve the `dist` directory through a local HTTP server because the site loads `content.json` with `fetch`.

With Python:

```bash
python -m http.server 5500 --directory dist
```

With Node.js (no dependencies):

```bash
node serve.mjs
```

With the VS Code Live Server extension, right-click `dist/index.html` and choose **Open with Live Server**.

Then open `http://localhost:5500`.

## Production

There is no compilation step. The production artifact is the complete `dist/` directory. The GitHub repository is connected to Vercel with `dist` configured as the project root, so pushes to `main` publish the production website automatically.

Production URL: `https://hoang-ngoc-dieu-anh-portfolio.vercel.app`

Before changing domains, update the canonical, Open Graph, and Twitter image URLs in `dist/index.html`.

## Main files

- `dist/index.html` — semantic page architecture, SEO metadata, and dialog shells
- `dist/styles.css` — visual system, responsive layouts, motion, and accessibility states
- `dist/app.js` — data rendering, dialogs, gallery, navigation, and scroll behavior
- `dist/content.json` — verified research, project, activity, experience, and award content
- `dist/assets/` — photographs, certificates, fonts, video, favicon, and résumé
- `.gitignore` — excludes local hosting metadata, Vercel state, and QA captures

## Editing principles

- Preserve factual accuracy and distinguish team outcomes from individual contributions.
- Do not add awards, results, responsibilities, or impact figures without a verified source.
- Use real student media only; do not substitute stock photography.
- Keep the site usable by keyboard and with `prefers-reduced-motion` enabled.
