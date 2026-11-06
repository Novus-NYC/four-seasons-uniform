"use client"

import { useEffect, useRef } from "react"
import SceneSvg, { BoxBackParts, BoxFrontParts, StreetLayer, TrainCars, attrsFor } from "./scene-svg"
import { BOX_HANDOFF, FOCUS, STORY_RANGE, chapterAt, computeFrame, type Frame } from "./scene"

type Props = { steps: readonly string[] }

/** Seconds. Time constant for easing the scene toward the scroll position. */
const TAU = 0.085
/** Larger jumps than this (anchor links, refresh mid-page) snap instead of sweeping. */
const SNAP_DISTANCE = 1.25

const initialFrame = computeFrame(STORY_RANGE.min, true)
/** The flying box is drawn as it looks at the handoff: flaps shut, taped, tag hung. No data-k keys. */
const handoffFrame: Frame = computeFrame(BOX_HANDOFF)
const handoffAttrs = (k: string) => ({ ...(handoffFrame[k] ?? {}) })
const FONT = { fontFamily: "var(--font-display), ui-rounded, system-ui, sans-serif" }

/** Must match the media query that shows the live stage in globals.css. */
const LIVE_QUERY =
  "(prefers-reduced-motion: no-preference) and (min-width: 1024px), (prefers-reduced-motion: no-preference) and (min-height: 520px)"

export default function StoryStage({ steps }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const section = root?.closest<HTMLElement>(".story")
    const svg = root?.querySelector<SVGSVGElement>("svg[data-product]")
    const street = root?.querySelector<HTMLElement>("[data-street]")
    const train = root?.querySelector<SVGSVGElement>("svg[data-train]")
    const box = root?.querySelector<SVGSVGElement>("svg[data-fly]")
    if (!root || !section || !svg || !street || !train || !box) return

    const live = window.matchMedia(LIVE_QUERY)
    const els = new Map<string, Element>()
    root.querySelectorAll("[data-k]").forEach((el) => els.set(el.getAttribute("data-k") as string, el))
    // Maps the scene's 600 x 600 world onto the stage, matching the product svg's viewBox fit.
    let fit = { k: 1, ox: 0, oy: 0 }
    let lastStreet = ""
    let lastTrain = ""
    let lastOpacity = -1
    let lastBox = ""
    let lastBoxOpacity = -1
    const stepEls = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"))
    const cache = new Map<string, Record<string, string>>()

    let tops: number[] = []
    let navH = 64
    let target = 0
    let current = 0
    let raf = 0
    let lastTime = 0
    let visible = false
    let activeStep = -1

    const measure = () => {
      navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64
      // Narrow portrait stages (phones) crop the scene's side margins so it reads larger.
      const w = root.clientWidth
      const h = root.clientHeight
      const slice = w < 640 && h > 0 && w / h < 0.95
      svg.setAttribute("preserveAspectRatio", slice ? "xMidYMid slice" : "xMidYMid meet")
      const k = (slice ? Math.max(w, h) : Math.min(w, h)) / 600
      fit = { k, ox: (w - 600 * k) / 2, oy: (h - 600 * k) / 2 }
      lastStreet = ""
      lastBox = ""
      const y = window.scrollY
      tops = Array.from(section.querySelectorAll<HTMLElement>(".story-chapter")).map(
        (el) => el.getBoundingClientRect().top + y,
      )
    }

    /** Story time: chapter i rests at t = i, when its block reaches the top of the stage. */
    const readTarget = () => {
      if (tops.length < 2) return 0
      const y = window.scrollY + navH
      const last = tops.length - 1
      let t: number
      if (y < tops[0]) t = (y - tops[0]) / (tops[1] - tops[0])
      else if (y >= tops[last]) t = last + (y - tops[last]) / (tops[last] - tops[last - 1])
      else {
        let i = 0
        while (i < last - 1 && y >= tops[i + 1]) i++
        t = i + (y - tops[i]) / (tops[i + 1] - tops[i])
      }
      return Math.max(STORY_RANGE.min, Math.min(STORY_RANGE.max, t))
    }

    const apply = (t: number) => {
      const frame = computeFrame(t, true)
      for (const key in frame) {
        const el = els.get(key)
        if (!el) continue
        let prev = cache.get(key)
        if (!prev) {
          prev = {}
          cache.set(key, prev)
        }
        const attrs = frame[key]
        for (const name in attrs) {
          const v = String(attrs[name])
          if (prev[name] !== v) {
            el.setAttribute(name, v)
            prev[name] = v
          }
        }
      }
      /* The street and train are separate <svg> boxes moved with CSS transforms, which costs a
         composite instead of an SVG relayout of the whole shop front every frame. */
      const cam = frame.streetCam as { x: number; y: number; s: number; opacity: number; trainX: number }
      if (cam.opacity !== lastOpacity) {
        lastOpacity = cam.opacity
        street.style.opacity = String(cam.opacity)
        street.style.visibility = cam.opacity > 0 ? "visible" : "hidden"
      }
      if (cam.opacity > 0) {
        const st = `translate(${fit.ox}px,${fit.oy}px) scale(${fit.k}) translate(${cam.x}px,${cam.y}px) scale(${cam.s}) translate(${-FOCUS.x}px,${-FOCUS.y}px)`
        if (st !== lastStreet) street.style.transform = lastStreet = st
        const tt = `translate(${cam.trainX}px,0)`
        if (tt !== lastTrain) train.style.transform = lastTrain = tt
      }

      const bc = frame.boxCam as { x: number; y: number; s: number; opacity: number }
      if (bc.opacity !== lastBoxOpacity) {
        lastBoxOpacity = bc.opacity
        box.style.opacity = String(bc.opacity)
        box.style.visibility = bc.opacity > 0 ? "visible" : "hidden"
      }
      if (bc.opacity > 0) {
        const bt = `translate(${fit.ox}px,${fit.oy}px) scale(${fit.k}) translate(${bc.x}px,${bc.y}px) scale(${bc.s})`
        if (bt !== lastBox) box.style.transform = lastBox = bt
      }

      const step = chapterAt(t)
      if (step !== activeStep) {
        activeStep = step
        stepEls.forEach((el, i) => el.toggleAttribute("data-active", i === step))
      }
    }

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000))
      lastTime = now
      const diff = target - current
      if (Math.abs(diff) > SNAP_DISTANCE) current = target
      else current += diff * (1 - Math.exp(-dt / TAU))
      if (Math.abs(target - current) < 0.0005) current = target
      apply(current)
      if (current !== target && visible && !document.hidden) raf = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (raf || !visible || document.hidden || !live.matches) return
      lastTime = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const onScroll = () => {
      target = readTarget()
      kick()
    }

    /* Mobile browsers fire resize while the URL bar collapses mid-scroll, so this re-measures
       and keeps easing rather than snapping. */
    const onResize = () => {
      measure()
      target = readTarget()
      kick()
    }

    const onVisibility = () => (document.hidden ? stop() : kick())
    const onLiveChange = () => (live.matches ? onResize() : stop())

    measure()
    target = current = readTarget()
    apply(current)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) onScroll()
        else stop()
      },
      { rootMargin: "100px 0px" },
    )
    io.observe(root)

    const ro = new ResizeObserver(onResize)
    ro.observe(section)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", onVisibility)
    live.addEventListener("change", onLiveChange)
    document.fonts?.ready.then(onResize).catch(() => {})

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
      live.removeEventListener("change", onLiveChange)
    }
  }, [])

  return (
    <div ref={rootRef} className="relative h-full w-full">
      <div data-street className="invisible absolute left-0 top-0 h-[600px] w-[600px] origin-top-left opacity-0">
        <svg viewBox="0 0 600 600" width="600" height="600" overflow="visible" className="absolute inset-0" style={FONT}>
          <StreetLayer id="story-live-street" a={attrsFor(initialFrame)} />
        </svg>
        <svg data-train viewBox="0 0 600 600" width="600" height="600" overflow="visible" className="absolute inset-0">
          <TrainCars />
        </svg>
      </div>
      <SceneSvg frame={initialFrame} id="story-live" inlineStreet={false} className="absolute inset-0 h-full w-full" />
      <svg
        data-fly
        viewBox="0 0 600 600"
        width="600"
        height="600"
        overflow="visible"
        className="invisible absolute left-0 top-0 origin-top-left opacity-0"
        style={FONT}
      >
        <BoxBackParts />
        <BoxFrontParts a={handoffAttrs} />
      </svg>
      <ol className="story-progress absolute inset-x-0 bottom-2 flex justify-center gap-2.5 px-4 text-[13px] font-semibold text-muted lg:bottom-6 lg:gap-6">
        {steps.map((s, i) => (
          <li
            key={s}
            data-step={i}
            className="flex items-center gap-1.5 opacity-60 data-[active]:text-awning data-[active]:opacity-100 [&[data-active]_.dot]:scale-125 [&[data-active]_.dot]:bg-awning"
          >
            <span className="dot h-1.5 w-1.5 rounded-full bg-muted/50" />
            <span className="sr-only lg:not-sr-only">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
