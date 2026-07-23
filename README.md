# Braxon's Sticky Notes
A simple sticky-notes extension for your browser — quick notes right in your toolbar, no tabs, no accounts, no cloud.

<img src="/Images/StickyNotesExtensionIcon@500x.png" width="160" alt="icon" />

## Features
- **Multiple notes** — switch with the dropdown, add new ones with `+`
- **Bold / italic formatting** — wrap text in `<b>` or `<i>` tags
- **Two themes** — Classic (yellow legal-pad) or Modern (minimal)
- **Delete confirmation** — optional prompt before clearing a note
- **Export / Import** — back up or restore notes as a JSON file
- **Local storage** — everything stays on your machine

## Installing
Not on the Chrome Web Store, so load it manually:
1. Download or clone this repo
2. Go to `chrome://extensions`, enable **Developer mode**
3. Click **Load unpacked**, select the project folder
4. Pin the extension and click the icon to open your notes

Or see the [tutorial video](#) for a walkthrough. (COMING SOON)

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
