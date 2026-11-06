# Four Seasons Uniform

Website for Four Seasons Uniform, a scrubs, uniform and work shoe shop at 73-19 Roosevelt Ave in Jackson Heights, Queens, under the 7 train. Built on the Novus base template.

## Tech stack

- Next.js (App Router), TypeScript, Tailwind CSS
- No animation or 3D libraries. The scroll scene is hand-authored SVG driven by a small rAF loop.

## Where things live

- `src/lib/business.ts`: **every business fact** (name, phone, address, hours, policy, brands, colors, reviews, photos). Corrections are one-line edits here. Items marked `CONFIRM` are pending owner review.
- `src/app/page.tsx`: home. `src/app/pages/{what-we-carry,about,visit}`: subpages.
- `src/lib/components/scroll-story/`: the home page scroll scene.
  - `scene.ts`: the scene as a pure function of story time `t` (0 to 3 = the four chapters).
  - `scene-svg.tsx`: SVG markup, keyed with `data-k` attributes.
  - `story-stage.tsx`: live pinned stage (eases toward scroll, runs only while visible).
  - `scroll-story.tsx`: chapters and copy, plus static snapshots for no-JS and reduced motion.
- `public/images`: self-hosted, optimized WebP photos.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Before launch

- Get permission for the Google Maps customer photos in `public/images`, or replace them with owner photos.
- Resolve every `CONFIRM` note in `src/lib/business.ts`.
- Set `NEXT_PUBLIC_SITE_URL` to the live domain (used for metadata and structured data).
