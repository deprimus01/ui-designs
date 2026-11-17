# Bin Ismail General Printing and Press — website

Static site, no build step. Open `index.html` or deploy the folder as-is (Vercel, Netlify, GitHub Pages).

```
bin-ismail-website/
├── index.html                  markup only (~1,600 lines)
├── css/                        loaded in this order — order matters (cascade)
│   ├── 01-base.css             tokens, reset, layout
│   ├── 02-nav-buttons.css
│   ├── 03-hero.css … 10-card-shapes-steps.css   section styles
│   ├── 11-icons.css            Font Awesome subset (@font-face + glyph map)
│   ├── 12-forms-chips.css
│   ├── 13-theme-dark.css       dark theme + logo swap
│   ├── effects.css             motion / hover effects
│   ├── hero.css, hero-left.css
├── js/
│   ├── theme-init.js           runs in <head> to avoid theme flash
│   ├── core.js                 theme toggle, menu, reveal-on-scroll
│   ├── typewriter.js, segments.js, quote-form.js
│   ├── effects.js, hero.js, hero-particles.js
├── vendor/
│   └── tsparticles.slim.bundle.js   third-party, do not edit
├── fonts/                      Font Awesome subset (solid + brands)
└── images/
    ├── logo-light.webp, logo-dark.webp
    ├── icons/                  favicon + apple-touch-icon
    └── gallery/                13 product photos (named by content)
```

Scripts at the end of `index.html` run in the same order as the original single file.
