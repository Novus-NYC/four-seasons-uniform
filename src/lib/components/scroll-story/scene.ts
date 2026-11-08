/**
 * The scroll story scene, as a pure function of story time `t`.
 *
 * t = 0, 1, 2, 3 are the resting points of the four chapters (the moment each
 * chapter's copy settles into view). Everything in between is choreography.
 *
 *   0  Colors          a scrub top on a hanger cycles through real rack colors
 *   1  Fit             a tape measure; the top reshapes for petite, tall, maternity
 *   2  Special orders  the top folds into a box tagged "No extra charge"
 *   3  The shop        the box heads into the shop; camera pulls back to the awning
 *                      under the 7 train as a train rolls past
 *
 * The same function renders the static snapshots (server side) and drives the
 * live stage (client side), so the two can never drift apart.
 */

import { business } from "@/lib/business"

export type Attrs = Record<string, string | number>
export type Frame = Record<string, Attrs>

/* ---------------------------------------------------------------- math */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const lerp = (a: number, b: number, u: number) => a + (b - a) * u
const smooth = (u: number) => u * u * (3 - 2 * u)
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3)
const easeInOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2)
const easeOutBack = (u: number) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2)
}
/** Normalized progress of t through [a, b]. */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))
/** Rises over [a, b], holds, falls over [c, d]. */
const window4 = (t: number, a: number, b: number, c: number, d: number) =>
  Math.min(smooth(seg(t, a, b)), 1 - smooth(seg(t, c, d)))
const n = (v: number) => Math.round(v * 100) / 100

/* -------------------------------------------------------------- colors */

type RGB = [number, number, number]
const hexToRgb = (hex: string): RGB => {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}
const mix = (a: RGB, b: RGB, u: number): RGB => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]
const css = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`
const BLACK: RGB = [46, 32, 40]

export const SWATCHES = business.colors.map((c) => ({ name: c.name, rgb: hexToRgb(c.hex), hex: c.hex }))
export const SWATCH_X = (i: number) => 300 + (i - (SWATCHES.length - 1) / 2) * 40
export const SWATCH_Y = 548

/* ------------------------------------------------------------- garment */

type G = { W: number; H: number; hem: number; sl: number; sa: number; cw: number; arm: number; vd: number }

const BASE: G = { W: 92, H: 250, hem: 97, sl: 74, sa: 0.62, cw: 46, arm: 96, vd: 62 }
const PETITE: G = { ...BASE, W: 86, H: 210, hem: 90, sl: 66, cw: 42, arm: 88, vd: 56 }
const TALL: G = { ...BASE, H: 296, hem: 98, sl: 78, arm: 100 }
const MATERNITY: G = { ...BASE, W: 98, H: 266, hem: 126, sl: 74 }
const FOLDED: G = { W: 100, H: 150, hem: 100, sl: 6, sa: 1.2, cw: 4, arm: 40, vd: 48 }

const mixG = (a: G, b: G, u: number): G => ({
  W: lerp(a.W, b.W, u),
  H: lerp(a.H, b.H, u),
  hem: lerp(a.hem, b.hem, u),
  sl: lerp(a.sl, b.sl, u),
  sa: lerp(a.sa, b.sa, u),
  cw: lerp(a.cw, b.cw, u),
  arm: lerp(a.arm, b.arm, u),
  vd: lerp(a.vd, b.vd, u),
})

type GarmentShape = {
  body: string
  inner: string
  neck: string
  seams: string
  pocket: { x: number; y: number; w: number; h: number }
  top: number
  hemY: number
  hanger: string
  hook: string
}

/** A V-neck scrub top, centered on (0, 0). Same command list for every shape, so it morphs cleanly. */
export function garmentShape(g: G): GarmentShape {
  const top = -g.H / 2
  const nw = 30
  const neckY = top
  const vY = top + g.vd
  const S: [number, number] = [g.W + 8, top + 8]
  const dx = Math.cos(g.sa)
  const dy = Math.sin(g.sa)
  const O: [number, number] = [S[0] + g.sl * dx, S[1] + g.sl * dy]
  const I: [number, number] = [O[0] - g.cw * dy, O[1] + g.cw * dx]
  const A: [number, number] = [g.W, top + g.arm]
  const hemY = top + g.H
  const C: [number, number] = [g.W + (g.hem - g.W) * 0.15, top + g.arm + (g.H - g.arm) * 0.55]

  const body = [
    `M0 ${n(vY)}`,
    `L${nw} ${n(neckY)}`,
    `L${n(S[0])} ${n(S[1])}`,
    `L${n(O[0])} ${n(O[1])}`,
    `L${n(I[0])} ${n(I[1])}`,
    `L${n(A[0])} ${n(A[1])}`,
    `Q${n(C[0])} ${n(C[1])} ${n(g.hem)} ${n(hemY)}`,
    `Q0 ${n(hemY + 9)} ${n(-g.hem)} ${n(hemY)}`,
    `Q${n(-C[0])} ${n(C[1])} ${n(-A[0])} ${n(A[1])}`,
    `L${n(-I[0])} ${n(I[1])}`,
    `L${n(-O[0])} ${n(O[1])}`,
    `L${n(-S[0])} ${n(S[1])}`,
    `L${-nw} ${n(neckY)}Z`,
  ].join("")

  return {
    body,
    inner: `M${-nw} ${n(neckY)}Q0 ${n(neckY + 24)} ${nw} ${n(neckY)}Z`,
    neck: `M${-nw} ${n(neckY)}L0 ${n(vY)}L${nw} ${n(neckY)}`,
    seams: `M${n(S[0])} ${n(S[1])}L${n(A[0])} ${n(A[1])}M${n(-S[0])} ${n(S[1])}L${n(-A[0])} ${n(A[1])}`,
    pocket: { x: n(g.W * 0.24), y: n(top + Math.min(104, g.H * 0.42)), w: 38, h: 42 },
    top,
    hemY,
    hanger: `M${n(-g.W - 6)} ${n(top + 12)}L0 ${n(top - 14)}L${n(g.W + 6)} ${n(top + 12)}`,
    hook: `M0 ${n(top - 14)}L0 ${n(top - 26)}C0 ${n(top - 42)} 18 ${n(top - 44)} 18 ${n(top - 32)}`,
  }
}

/* --------------------------------------------------------------- layout */

/** Where the street layer's camera focuses when zoomed in (world coords). */
export const FOCUS = { x: 300, y: 430 }
const ZOOM = 2.6
/** Where the box disappears into: the shop door. */
const DOOR = { x: 456, y: 488 }
const BOX_REST = { x: 300, y: 388 }

/** Fit chapter: which variant shows when, and its tag. */
export const FIT_TAGS = [
  { key: "tag0", label: "Petite", x: 64, y: 166 },
  { key: "tag1", label: "Tall", x: 462, y: 124 },
  { key: "tag2", label: "Maternity-friendly", x: 56, y: 456 },
  { key: "tag3", label: "Women's · Men's · Unisex", x: 300, y: 540, center: true },
] as const

export const STORY_RANGE = { min: -1, max: 3.45 }

/* ---------------------------------------------------------------- frame */

/**
 * From here on the live stage flies a separate, CSS-transformed copy of the box (see
 * story-stage.tsx). At this moment the box is at rest, so the swap is invisible.
 */
export const BOX_HANDOFF = 2.5

export function computeFrame(tIn: number, live = false): Frame {
  const t = Math.max(STORY_RANGE.min, Math.min(STORY_RANGE.max, tIn))
  const f: Frame = {}

  /* Chapter 0: colors ------------------------------------------------- */
  const intro = easeOut(seg(t, -0.7, -0.2))
  const ci = clamp01((t + 0.2) / 0.78) * (SWATCHES.length - 1)
  const i0 = Math.min(SWATCHES.length - 2, Math.floor(ci))
  const blend = smooth(seg(ci - i0, 0.5, 1))
  const color = mix(SWATCHES[i0].rgb, SWATCHES[i0 + 1].rgb, ci >= SWATCHES.length - 1 ? 1 : blend)
  const activeX = lerp(SWATCH_X(i0), SWATCH_X(i0 + 1), ci >= SWATCHES.length - 1 ? 1 : blend)
  const activeIdx = ci >= SWATCHES.length - 1 ? SWATCHES.length - 1 : blend > 0.5 ? i0 + 1 : i0

  const swOut = smooth(seg(t, 0.55, 0.75))
  const swIn = easeOut(seg(t, -0.55, -0.1))
  f.swatches = {
    opacity: n(Math.min(swIn, 1 - swOut)),
    transform: `translate(0 ${n((1 - swIn) * 18 + swOut * 22)})`,
  }
  f.swRing = { transform: `translate(${n(activeX)} ${SWATCH_Y})` }
  SWATCHES.forEach((_, i) => {
    const on = i === activeIdx ? 1 : 0
    f[`swLabel${i}`] = { opacity: on }
    f[`sw${i}`] = { transform: `translate(${n(SWATCH_X(i))} ${SWATCH_Y}) scale(${i === activeIdx ? 1.12 : 1})` }
  })

  /* Chapter 1: fit ---------------------------------------------------- */
  const toPetite = easeInOut(seg(t, 0.74, 0.9))
  const toTall = easeInOut(seg(t, 1.0, 1.12))
  const toMat = easeInOut(seg(t, 1.2, 1.32))
  const toBase = easeInOut(seg(t, 1.42, 1.54))
  let g = mixG(BASE, PETITE, toPetite)
  g = mixG(g, TALL, toTall)
  g = mixG(g, MATERNITY, toMat)
  g = mixG(g, BASE, toBase)

  /* Chapter 2: fold, box, tag ---------------------------------------- */
  const fold = easeInOut(seg(t, 1.6, 1.86))
  g = mixG(g, FOLDED, fold)
  const shape = garmentShape(g)

  const boxRise = easeOut(seg(t, 1.68, 1.96))
  const drop = easeInOut(seg(t, 1.94, 2.14))
  const flaps = easeInOut(seg(t, 2.12, 2.3))
  const tape = easeOut(seg(t, 2.27, 2.36))
  const tagSwing = seg(t, 2.24, 2.46)

  /* Chapter 3: the shop ---------------------------------------------- */
  const zoomU = easeInOut(seg(t, 2.55, 3.0))
  const streetIn = smooth(seg(t, 2.52, 2.7))
  const toDoor = easeInOut(seg(t, 2.55, 2.95))
  const boxGone = smooth(seg(t, 2.84, 2.98))
  const s = lerp(ZOOM, 1, zoomU)
  const k = (ZOOM - s) / (ZOOM - 1)
  const fzx = lerp(300, FOCUS.x, k)
  const fzy = lerp(300, FOCUS.y, k)
  const cam = (wx: number, wy: number) => [fzx + s * (wx - FOCUS.x), fzy + s * (wy - FOCUS.y)] as const

  /* Garment placement ------------------------------------------------- */
  const gy = lerp(300, 262, fold) + drop * 120
  const gScale = lerp(1, 0.9, fold) * lerp(1, 0.86, drop)
  f.product = {
    opacity: n(intro),
    transform: `translate(0 ${n((1 - intro) * 26)})`,
  }
  f.garment = {
    transform: `translate(300 ${n(gy)}) scale(${n(gScale)})`,
    opacity: t > 2.32 ? 0 : 1,
  }
  const c = css(color)
  f.gBody = { d: shape.body, fill: c }
  f.gTwill = { d: shape.body }
  f.gShade = { d: shape.body }
  f.gInner = { d: shape.inner, fill: css(mix(color, BLACK, 0.5)) }
  f.gNeck = { d: shape.neck, stroke: css(mix(color, BLACK, 0.28)) }
  f.gSeams = { d: shape.seams, stroke: css(mix(color, BLACK, 0.35)) }
  f.gPocket = {
    x: shape.pocket.x,
    y: shape.pocket.y,
    width: shape.pocket.w,
    height: shape.pocket.h,
    stroke: css(mix(color, BLACK, 0.3)),
  }
  f.hanger = { d: shape.hanger, opacity: n(1 - smooth(seg(t, 1.56, 1.7))) }
  f.hook = { d: shape.hook, opacity: n(1 - smooth(seg(t, 1.56, 1.7))) }

  /* Tape measures (follow the live garment geometry) */
  const tapeIn = easeOut(seg(t, 0.62, 0.84))
  const tapeOut = smooth(seg(t, 1.55, 1.68))
  const tapeO = n(Math.min(1, tapeIn * 1.6) * (1 - tapeOut))
  const chestY = gy + (shape.top + 112) * gScale
  const tw = (g.W * 2 + 44) * gScale
  f.tapeH = {
    x: n(300 - tw / 2),
    y: n(chestY - 8),
    width: n(Math.max(0.01, tw * tapeIn)),
    opacity: tapeO,
  }
  const vx = 300 + Math.max(g.W + 8 + g.sl * Math.cos(g.sa) + 16, g.hem + 24) * gScale
  const vTop = gy + shape.top * gScale
  const vh = (shape.hemY - shape.top) * gScale
  f.tapeV = {
    x: n(vx),
    y: n(vTop),
    height: n(Math.max(0.01, vh * tapeIn)),
    opacity: tapeO,
  }

  /* Fit tags: pop in with their variant, glow while active, then settle. */
  const tagTimes: [number, number][] = [
    [0.76, 1.0],
    [1.0, 1.2],
    [1.2, 1.42],
    [1.42, 9],
  ]
  const tagsOut = smooth(seg(t, 1.56, 1.7))
  FIT_TAGS.forEach((tag, i) => {
    const [a, b] = tagTimes[i]
    const appear = seg(t, a, a + 0.1)
    const pop = appear <= 0 ? 0 : easeOutBack(appear)
    const active = window4(t, a, a + 0.06, b - 0.02, b + 0.06)
    f[tag.key] = {
      opacity: n(clamp01(appear * 1.5) * (1 - tagsOut)),
      transform: `translate(${tag.x} ${n(tag.y + (1 - clamp01(pop)) * 10 + tagsOut * -8)}) scale(${n(0.86 + 0.14 * pop)})`,
    }
    f[`${tag.key}On`] = { opacity: n(active) }
  })

  /* Box (two groups so the folded top drops between its back and front) */
  const bx = lerp(BOX_REST.x, cam(DOOR.x, DOOR.y)[0], toDoor)
  const byRest = lerp(560, BOX_REST.y, boxRise)
  const by = lerp(byRest, cam(DOOR.x, DOOR.y)[1], toDoor)
  const bs = lerp(1, s * 0.2, toDoor)
  const boxO = n(clamp01(boxRise * 2) * (1 - boxGone))
  const flying = live && t >= BOX_HANDOFF
  // While the live copy flies, the hidden in-scene box is frozen so it costs nothing.
  const boxT = flying ? `translate(${BOX_REST.x} ${BOX_REST.y}) scale(1)` : `translate(${n(bx)} ${n(by)}) scale(${n(bs)})`
  f.boxBack = { transform: boxT, opacity: flying ? 0 : boxO }
  f.boxFront = { transform: boxT, opacity: flying ? 0 : boxO }
  f.boxCam = { x: n(bx), y: n(by), s: n(bs), opacity: flying ? boxO : 0 }
  f.flapL = { transform: `rotate(${n(lerp(-128, 0, flaps))} -110 -60)` }
  f.flapR = { transform: `rotate(${n(lerp(128, 0, flaps))} 110 -60)` }
  f.boxTape = { transform: `translate(-16 -66) scale(1 ${n(Math.max(0.001, tape))})`, opacity: n(tape > 0 ? 1 : 0) }
  const swing = tagSwing <= 0 ? -70 : lerp(-70, 0, easeOutBack(tagSwing))
  f.orderTag = {
    transform: `rotate(${n(swing)} 96 -36)`,
    opacity: flying ? 1 : n(clamp01(tagSwing * 4) * (1 - smooth(seg(t, 2.56, 2.7)))),
  }

  /* Street: camera pull-back, train, neon */
  f.street = {
    opacity: n(streetIn),
    transform: `translate(${n(fzx)} ${n(fzy)}) scale(${n(s)}) translate(${-FOCUS.x} ${-FOCUS.y})`,
  }
  const trainX = n(lerp(640, -620, seg(t, 2.6, 3.45)))
  f.train = { transform: `translate(${trainX} 0)` }
  /* Plain numbers for the live stage, which moves the street with CSS transforms instead. */
  f.streetCam = { x: n(fzx), y: n(fzy), s: n(s), opacity: n(streetIn), trainX }
  f.neon = { opacity: n(smooth(seg(t, 2.86, 2.98))) }
  f.stageTint = { opacity: n(1 - streetIn) }

  return f
}

/** Representative moments used for the static (no JS / reduced motion) panels. */
export const SNAPSHOT_T = [0.06, 1.5, 2.5, 3.12] as const

/** Which chapter is "current" for the progress indicator. */
export const chapterAt = (t: number) => Math.max(0, Math.min(3, Math.round(t)))
