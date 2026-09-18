# Top Pill Tabs — fork starter (matches screenshot)

This branch (`feat/top-pill-tabs`) is your UI experiment branch in your fork:
- origin: https://github.com/nocdn/helium (your fork — safe to push here)
- upstream: https://github.com/imputnet/helium (do NOT PR there without manual rewrite — see note below)

Screenshot reference: macOS window, traffic lights left, pinned favicons `X D C G S`,
group pill `Office Commun`, active pill `Norma — Block distra…`, `+` button. No visible
omnibox in the top row — tabs are centered pills.

## 1. Live prototype (no build needed)

Open in browser:

```
top-pill-tabs-prototype/index.html
```

What it demos:
- pill tabs, pinned icons, group pill, active state, hover physics
- spring `cubic-bezier(.34,1.56,.64,1)` for hover / open / new-tab
- close-on-hover, new-tab pop, drag-to-reorder
- window chrome + mock NORMA page so you can judge spacing

Tweak `styles.css` first — it's 10x faster than rebuilding Chromium.

## 2. Where the real Helium tab UI lives

Helium Classic layout = tabs on top (what you want). Key files patched by Helium:

- `patches/helium/ui/tabs.patch`
  - `chrome/browser/ui/tabs/tab_style.cc` — `kTabWidth` (190), corner radii (8), separator margins
  - `chrome/browser/ui/views/tabs/horizontal_tab_style_views.cc` — `GetPath()` forces detached squarcle pill, `extension_corner_radius = 4`, hover paint
  - `chrome/browser/ui/views/tabs/tab.cc` — close-button visibility (`mouse_hovered_`), favicon centering, alert indicator layout
  - `tab/tab_close_button.cc` — round-rect inkdrop, `kCornerRadius = 4`

- `patches/helium/ui/layout/horizontal-tabs.patch`
  - `horizontal_tab_strip_region_view.cc` — new-tab button visibility per layout
  - trailing separator logic

- `patches/helium/ui/layout/toolbar-layout.patch`, `compact.patch`, `core.patch`
  - `HeliumLayoutStateController` (`kClassic/kCompact/kVertical/kDynamic`) decides if tabstrip draws on top

To get the screenshot look in real Chromium:

1. `tab_style.cc`: `kTabWidth 190 → 168`, `GetTopCornerRadius 8 → 10`, `GetBottomCornerRadius 8 → 10`, `kSeparatorThickness 1 → 0` (kills dividers like screenshot), increase `kTabHorizontalPadding 2 → 6` for pill gaps.
2. `horizontal_tab_style_views.cc`: `extension_corner_radius 4 → 10`, keep `if ((true))` detached-pill branch, set hover bg = active bg (already done: `GetCurrentTabBackgroundColor(selection_state, hovered)`), remove `PaintBackgroundHover` (already removed).
3. `tab.cc`: keep close-button-only-on-hover (`mouse_hovered_`), keep `kMinimumContentsWidthForCloseButtons = 56` for narrower pills.
4. Toolbar: in Classic layout the omnibox is in second row — to match screenshot (tabs-only top row, no URL bar visible) either hide toolbar in fullscreen-like mode or switch to Compact layout where `ToolbarView::UpdateToolbarLayout()` centers a small omnibox. See `centered-address-bar.patch`.
5. macOS frame: `rounded-frame-corners.patch` + `frame-radius-helper.patch` give the 12px window radius in screenshot. Don't touch.

After editing, refresh patches per Helium docs:
```
# in helium-macos checkout, after editing chromium source in helium-chromium/
./dev.sh refresh  # or see docs/building.md
```

## 3. Building (warning: heavy)

- Full Chromium build: ~100GB disk, 8GB+ RAM, hours on MacBook. See `helium-macos/docs/building.md` and `helium-macos/dev.sh`.
- Recommended flow: iterate in `top-pill-tabs-prototype/` → record values → apply once to `.patch` files → build once via GitHub Actions in your fork (free runners) instead of locally.

## 4. Upstream note

`AGENTS.md` in upstream asks to avoid AI-generated PRs to `imputnet/*`. This branch lives only in `nocdn/helium`. Don't open a PR upstream from this branch without hand-rewriting and testing the patch yourself.

## Next steps for you

- [ ] Open prototype, confirm radius/spacing vs screenshot
- [ ] Tell me target numbers (e.g. pill radius 10 vs 12, tab width 168 vs 190, gap 6 vs 8) + which animations (open/close/hover/drag spring, duration)
- [ ] I translate those into `tabs.patch` v2 in this branch
