---
name: update-settings-doc
description: >
  Sync src/manual/settings.md in this docs project with the actual settings page in the
  mybooks app (app/src/pages/admin/settings.vue). Use whenever the user asks to "更新设置文档"/
  "同步设置说明"/"update the settings doc", after settings.vue gains, removes, or changes a
  setting field/group/card, or periodically when asked to check the settings doc is still
  accurate. Do not use for unrelated manual pages (quickstart, tool-development, faq) — only
  for the settings reference page.
---

# Update the settings reference doc

`src/manual/settings.md` in this repo documents every configuration item on MyBooks'
`系统管理 - 设置` page. The page's source of truth is
`app/src/pages/admin/settings.vue` in the mybooks app repo (default location:
`/Volumes/data/projects/reader/mybooks/app/src/pages/admin/settings.vue`; ask the user
for the path if it's not available as a working directory). This skill keeps the two in
sync.

## Structure to know

- In settings.vue, `this.cards = [...]` (inside `created()`) is the ordered list of
  top-level collapsible cards — this is the **目录 / top-level list** the doc's
  "目录" section and `##` headings are built from. Each card's `title` key (e.g.
  `settings.basic_info`) maps to a Chinese label in the locale file.
- Within a card:
  - `fields`: flat list of settings, each `{ key, label, type, icon, color }`.
    `color: "red"` means the item needs a service restart to take effect — call this
    out in the doc, matching the existing "（需重启）" convention.
  - `groups`: a checkbox that reveals a nested set of `fields` when checked (e.g.
    `INVITE_MODE`, `ALLOW_REGISTER`) — document these as a `###` sub-section under the
    card, named after the group's checkbox label, prefixed with "勾选「...」后展开：".
  - `show_*` flags (`show_bookbarn`, `show_ai_capabilities`, `show_socials`,
    `show_friends`, `show_devices`, `show_stamp`, `show_ssl`, `show_trash`): the card
    renders a bespoke block instead of generic fields — read that block's template
    directly (it's a `<template v-if="card.show_xxx">` section in the same file) to see
    what it actually contains, since it isn't described by `fields`/`groups` data.
- Labels: the Chinese text for every `label`/`title` key lives in
  `app/locales/zh.json` under the `settings` object (same key, without the
  `settings.` prefix). Pull the doc's wording from there rather than inventing new
  phrasing, so the doc mirrors the actual UI text.

## Procedure

1. Read the current `cards` array in settings.vue (`created()`, `this.cards = [...]`)
   and diff its card titles, field keys, and group keys against what
   `src/manual/settings.md` currently documents.
2. For anything added: look up its label in `app/locales/zh.json` (`settings.<key>`),
   and any explanatory `subtitle`/`tips`/`description` text on the card, then add a
   bullet (or a new `##`/`###` section for a new card/group) in the same style as the
   surrounding entries — short, action-oriented, mirroring the UI wording rather than
   restating the raw key name.
3. For anything removed or renamed: delete or update the corresponding bullet/section.
   Don't leave stale entries.
4. For anything whose behavior/label changed: update the wording, and re-check whether
   it still needs the "（需重启）" marker (`color: "red"` in the field definition).
5. If a new card was added, also add it to:
   - the "目录" list near the top of `settings.md`
   - the sidebar in `.vitepress/config.mjs` (`sidebar['/manual/'][0].items`) — only if
     the card should be a separate page; for now settings.md covers ALL cards as one
     page, so a new card is just a new `##` section, not a new sidebar entry.
6. Keep the existing doc conventions: `##` per card (in card order), `###` for a group
   nested inside a card, plain bullet lists for flat fields, a `::: tip` block for any
   `tips`/plugin-install callouts, bold the field's Chinese label at the start of each
   bullet.
7. Skim the rendered diff for consistency (heading anchors still match the 目录 links,
   no orphaned links) — VitePress slugifies Chinese headings automatically, so anchors
   like `#基础信息` don't need manual escaping.

## Notes

- This is a one-way sync (vue → doc). Never edit settings.vue from this skill.
- Card order in the doc should always match card order in `this.cards` — don't
  reorder either side to "improve" grouping.
- If mybooks isn't available as a working directory in the current session, ask the
  user for its path (or the settings.vue/zh.json contents) before proceeding — don't
  guess at field behavior from the key name alone.
