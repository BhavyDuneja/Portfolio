# Portfolio Images

Drop the following files in this folder. Until they're added, the site shows a styled gradient placeholder — nothing breaks.

## Required files

| Filename | Client | Suggested content |
|---|---|---|
| `awish-clinic.jpg` | Awish Clinic | Screenshot of the clinic website homepage, or a clean photo of the clinic / staff |
| `education-aspire.jpg` | Education Aspire | Screenshot of the landing page, or a classroom / branding shot |
| `real-estate.jpg` | Real Estate Network | Listing site screenshot, or a property photo collage |

## Specs

- **Format:** JPG or PNG (JPG preferred — smaller file size)
- **Dimensions:** 1200x800 px or similar 3:2 ratio
- **File size:** under 300 KB each (use [tinypng.com](https://tinypng.com) to compress)
- **Filenames are case-sensitive on production** — keep them lowercase, exactly as listed

## Adding more clients

To add a new client, edit `components/anantasutra/Portfolio.tsx` — the `clients` array at the top. Each entry needs `name`, `industry`, `icon`, `image` path, `accent` color, `summary`, `services`, and `metrics`.
