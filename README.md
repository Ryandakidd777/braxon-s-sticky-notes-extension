# Braxon's Sticky Notes
A simple sticky-notes extension for your browser — quick notes right in your toolbar, no tabs, no accounts, no cloud.

<img src="/Images/StickyNotesExtensionIcon@500x.png" width="160" alt="icon" />

## Installing
[Tutorial page](https://braxonsstuff.com/Stuff/Braxons-Sticky-Notes/)

Or see the [tutorial video](https://youtu.be/29OVzBCaYMg) for a walkthrough & showcase

## Features
- **Multiple notes** — switch with the dropdown, add new ones with `+`
- **Bold / italic formatting** — wrap text in `<b>` or `<i>` tags
- **Two themes** — Classic (yellow legal-pad) or Modern (minimal)
- **Delete confirmation** — optional prompt before clearing a note
- **Export / Import** — back up or restore notes as a JSON file
- **Local storage** — everything stays on your machine

Works in most Chromium-based browsers (Chrome, Edge, Brave, etc).

- Click the icon, start typing — it saves as you go
- Click away to preview formatting, click again to edit
- Switch notes with the dropdown, or add one with `+`
- Gear icon opens **Settings** — rich text, delete confirmation, theme, export/import

## Project structure
```
├── manifest.json   # extension config
├── popup.html      # popup UI
├── popup.css       # styling / themes
├── popup.js        # all the logic
└── icon.png        # extension icon
```

## Built with
Plain HTML, CSS, JS — no frameworks, no dependencies. Storage via the browser's `storage` API.

---
Made by Braxon — [braxonsstuff.com](https://braxonsstuff.com)
