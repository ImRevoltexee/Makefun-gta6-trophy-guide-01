# Leonida Legend — GTA VI Trophy Guide

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ImRevoltexee/Makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ImRevoltexee/Makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze) — with an original guide for every trophy, a platinum roadmap, and a progress planner.

## What it is

- **Every trophy, exactly as PlayStation publishes it** — all 55 official names and descriptions, with grades. The list matches Exophase and PSNProfiles on every name, description and grade.
- **A guide in my own words for each trophy** — what to do, where and how, and when it can be missed. Every guide cites its sources with visible links (Exophase, PSNProfiles, PowerPyx, GTABase). Where the game has only just launched and no source pins down a location, step or trigger yet, the guide says so plainly instead of inventing one.
- **The one missable trophy, flagged everywhere** — Positive Mental Attitude (meditate at every spot) is the only possibly missable trophy, per PowerPyx: the Chapter 1 balcony meditation with Lucia. It is flagged in the list, in the detail pane, in the planner (first suggestion) and in the roadmap.
- **Platinum roadmap** — 7 ordered steps from Chapter 1 to the 100% checklist (A Long Road), built from the official descriptions and PowerPyx's roadmap: ~200 hours, 4/10 difficulty, one playthrough, no mission replay, cheats off.
- **Tracker** — checklist saved in localStorage, progress bar and per-grade counters (X/55, platinum/gold/silver/bronze), filters by grade and by kind (story / missable / collectibles / activities / online), search box, spoiler mode that hides story-trophy names and descriptions until earned, hide-earned toggle.
- **Trophy detail pane** — full guide, missable warning, sources with links, and a per-trophy notes field (saved in localStorage).
- **Next-up planner** — suggests the next 6 trophies from your current progress: missable first, then story, then quick wins, then the long grinds, platinum last.
- **Export / import** — progress (earned trophies + notes) exports as JSON and imports back.

## How to run offline

No build step, no network. Serve `app/` with any static server and open it:

```sh
node serve.ts
```

then open http://localhost:8080. Or open `app/index.html` directly from any static host. The app loads only its own files (system font stack, no external images, fonts or scripts) and makes no network request at run time.

## Sources

- Exophase — https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles — https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- PowerPyx — https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- GTABase — https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series

## License

MIT — see LICENSE. No Rockstar Games logo or official artwork is used anywhere in this guide.
