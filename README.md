# Manzur Gentlemens Hairdressers — website

Single-page site for the barber's at No. 1 Commercial Arcade, St Peter Port. Plain HTML, Tailwind CSS v3 (compiled and committed) and a small vanilla JS file. No frameworks, no CDNs.

```
index.html              the page (sections separated by comment banners)
thanks.html, 404.html   form thank-you page and not-found page, same design
assets/css/styles.css   compiled Tailwind (run npm run build after edits)
assets/js/main.js       opening hours + live signs, cut picker, menu, header, lightbox, form
assets/fonts/           self-hosted woff2 + OFL licences
images/brand/           logo traced to SVG: mark (the M with scissor rings) and wordmark, light/dark
images/work/            shop photos, name.webp (~1600px) + name-sm.webp (~800px)
images/                 favicons, og-image.jpg (share card), site.webmanifest
src/input.css           Tailwind source, @font-face, components, keyframes
tailwind.config.js      colours by role (with where each came from) and fonts
sitemap.xml, robots.txt
_fb-pack/               the Facebook source pack (not published: underscore folder)
_shots/                 screenshots for the team (not published)
```

## Brand

| Name | Hex | Used for |
|---|---|---|
| ink | `#171514` | The black fascia and logo. Hero, gallery and contact grounds, text |
| surface | `#edece8` | The painted shopfront panelling. Main light ground |
| paper | `#f7f6f3` | Lighter inside wall. Cards, photo frames, the appointment card |
| action | `#b3222b` | The barber's pole in the window. Call, Book and links only |
| accent | `#9a6a44` | The leather tool roll. Cords, today's tag, ring bullets, icons |
| support | `#4a3b34` | The barber chairs. Muted text on light grounds |

Fonts: **Sofia Sans Extra Condensed** (display, condensed caps like the OPEN sign and the shop's notices; times, prices and numbers drop to a hairline weight) and **Onest** (body). The logo was traced from the profile picture and the shop's own artwork into clean SVGs (same lettering, not redrawn).

## Editing

- **Text:** edit `index.html`.
- **Colours:** `tailwind.config.js`, then `npm install && npm run build`.
- **Opening hours:** change the `HOURS` table at the top of `assets/js/main.js`. Every sign on the page (hero sign, the week of tags, the footer) reads from it, using UK time. Also update the hours written in `index.html` (hero line, contact block, JSON-LD).
- **Cuts / prices:** the wet/dry picker is in the `CUTS` section of `index.html` (two tab buttons and two panels). Add a service by adding a tab + panel pair and an `<option>` in the form.
- **Adding a photo:** save `name.webp` (1600px wide) and `name-sm.webp` (800px) in `images/work/`, then copy one of the `<a class="tile …">` blocks in the `THE SHOP` section and set the `href`, `srcset`, alt text and `data-caption`.

## Going live — checklist

- [ ] Client buys their domain in their own name (roughly £10 a year for .com, £30–40 for .gg)
- [ ] Help the client create a free Cloudflare account in their name; connect this repo to Cloudflare Pages on their account (production branch `main`, no build command, output = repo root) and add their domain to the Pages project
- [ ] Swap the GitHub Pages URL for the real domain everywhere: canonical, og tags, JSON-LD, sitemap, robots, `_next`
- [ ] Switch the form from the team's email to the client's and activate FormSubmit
- [ ] Confirm phone/email; get the client to sign off the services wording
- [ ] Check assumptions (below) with Manzur
- [ ] Optional: transfer the repo to the client's own GitHub if they want it

### Assumptions to check

- **£28 for all wet and dry cuts** is taken from the sign in the shop window in their photos (undated). Confirm the price is current.
- No other services (beard trims, shaves, kids' cuts, fades) are listed anywhere in the pack, so the site only offers wet and dry cuts. Add more if they do them.
- No email address in the pack, so there is no `mailto:` link yet. Add one if they have a shop email.
- Wet/dry cut descriptions are written from the usual meaning of the terms; get Manzur to read them.
- Agnese is named from the shop's own Christmas post ("Agnese & Manzur").
- The Smaler's Charity Match paragraph comes from the organisers' post thanking the shop and the "Manzur Legends XI" poster.

### Left out on purpose

Holiday closure notices, Christmas and New Year times, the Liberation 80 post, the football (Newcastle) post, the wedding flowers photo and the review count. Only one written review exists, so there is no testimonials section; there are no haircut photos, so the gallery shows the shop.

Source: built from the Facebook pack in `_fb-pack/` (not published on the live site).
