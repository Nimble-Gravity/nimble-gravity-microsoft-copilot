# Client Customization

How to tailor this microsite for a specific client engagement **without forking the framework**. The generic site is the template; a client engagement swaps content in a small set of clearly-marked seams and leaves everything else (nav, design system, slide engine, skills mechanism) untouched.

> Scope note: this documents the **mechanism only**. No client-specific content (e.g. Antares) ships in `main`. Per the engagement plan, client packs are built on a client branch after the discovery call confirms scope.

## Branch convention (documented, not yet created)

```
main                     ← shared template (this repo)
└─ cowork                ← product track (current content)
   └─ client-<name>      ← one branch per engagement; edits ONLY inside marked slots
```

A client branch should touch only the swappable regions below. If a change has to happen outside a slot, it probably belongs back in the template — raise it rather than diverging the fork.

## Swappable regions: `data-client-slot`

Every client-replaceable region is wrapped in an element carrying a `data-client-slot="<key>"` attribute. The attribute is inert: it changes no rendering and is ignored by the slide engine (`slides-engine.js` reads classes/elements, never attributes), so marking a slot can never break a page or a deck.

Rules:
- Put the attribute on an **inner wrapper** (a `<span>` or `<div>` inside the section), never on a `.section` that must still generate a slide.
- Keep the generic placeholder content meaningful — the template must read well with no client applied.
- To find every slot in the repo: `grep -rn 'data-client-slot' .`

### Current slots (Brown & Brown Copilot build, 2026-07)

| Key | File | What to replace |
|---|---|---|
| `policy-status` / `data-classification` / `ground-rules` | `pages/workshops/acceptable-use.html` | The draft banner and OK/Not-OK data rules, replaced by the client's official Copilot policy. |
| `who-to-ask` | `acceptable-use.html`, `faq.html` (×2) | The client's escalation contact / enablement channel. |
| `feedback-form-post` / `feedback-form-30day` | `pages/workshops/feedback.html` | Live Microsoft Forms URLs for the two pulses. |
| `schedule-dates` | `pages/workshops/syllabus.html` | The confirmed session date/location. |
| `sponsor-message` | `pages/workshops/why-copilot.html` | The executive sponsor's name, title, and message. |

`SCAFFOLD` HTML comments mark tenant-dependent facts to confirm before delivery (Excel skills/connectors enabled, Frontier availability, agent billing policy) — grep for `SCAFFOLD`.

Add new slots as the engagement needs them; record each one in this table.

## Other swappable assets

- **Lab data** (`assets/lab-data/`): the synthetic finance datasets are B&B-shaped but fictional; a different client gets regenerated data. ⚠️ The Variance Vault and Close Room unlock codes are **derived from this data** — re-derive codes and re-run `node tools/generate-hashes.mjs` in `escape-room/` and `control-room/` after any change.
- **Discovery checklist** (`pages/customization/discovery-checklist.html`): run before the engagement; its answers drive which slots get filled.
- **Footer kicker / hero copy** (`footer.js`, `index.html`): light brand framing only.

## Adding or renaming a lesson? Update all the manifests

This is the one cross-cutting gotcha. The lesson list is duplicated in several places and they drift silently:
1. `nav.js` → `CRAFTS[n]` (`filePrefix[]` + positionally-zipped `pages[]` / `labels[]`)
2. `training-sidebar.js` → `MODULES[n].lessons[]`
3. `pages/training/module-N-slides.html` → `window.SLIDES_CFG.lessons[]`
4. `footer.js` → module chips (only if a module *name* changes)
5. `index.html` → the `.module-grid` cards
6. The `module-strip` block at the top of every lesson (first lesson of each module hardcoded)
7. `pages/workshops/my-progress.html` → the four quiz-lesson links (labs `03/07/11/16`)

New lessons **append** a new numeric prefix (17+) and are inserted at the right index in each array — display order is array order, not filename order. Always add the new prefix to the owning module's `filePrefix[]` in `nav.js`, or the page renders with an empty sub-nav.
