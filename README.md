# Anchor Surbhi — Website (Static)

This folder contains a static, responsive website for **Anchor Surbhi** (Home + Gallery).

## Run locally

### Option A (Python)

From this folder:

```bash
python -m http.server 5500
```

Open:
- `http://localhost:5500/`

### Option B (Node)

```bash
npx --yes serve -l 5500
```

## Update your content

- **Email**: edit `mailto:` + visible email in `index.html` (search `your-email@example.com`)
- **Social links**: edit `href="#"` in the footer in `index.html`
- **Hero/About images**: replace:
  - `assets/img/hero.jpg` (optimized hero photo)
  - `assets/img/about-placeholder.svg`
- **Gallery images**: replace `assets/img/gallery-01.svg` ... `gallery-12.svg` with your photos (same filenames), or update `gallery.html` and `index.html`.
- **Showreel**: replace the `<video>` source in `index.html` with your `.mp4` (or swap to a YouTube `<iframe>` embed).


# anchorsurbhi
