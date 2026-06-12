# Zygal Engineer Starter Kit

A mobile-friendly PWA field reference app for Zygal security engineers.

## GitHub Pages Deployment

1. Upload all files in this folder to your GitHub repository root
2. Go to **Settings → Pages** → set source to **main branch / root**
3. Your app will be live at `https://<username>.github.io/<repo-name>/`

## Files

| File | Purpose |
|---|---|
| `index.html` | Main app (13 MB — contains embedded device images) |
| `manifest.json` | PWA install config |
| `sw.js` | Service worker — enables offline use |
| `icon-512.png` | App icon (Play Store / splash) |
| `icon-192.png` | App icon (home screen) |
| `icon-180.png` | Apple Touch icon |
| `icon-32.png` | Favicon |
| `.nojekyll` | Prevents GitHub Pages Jekyll processing |

## Adding to Home Screen

**iOS Safari:** Tap Share → Add to Home Screen  
**Android Chrome:** Tap ⋮ menu → Add to Home Screen (or Install App banner)

## Notes
- The app works fully offline once cached by the service worker
- The `index.html` is ~13 MB due to embedded device images — this is a one-time download
- All subsequent loads are served from cache (fast, no network needed)
