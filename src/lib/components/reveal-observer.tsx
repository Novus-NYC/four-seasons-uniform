"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

declare global {
  interface Window {
    __fsReveal?: boolean
  }
}

/** Adds .is-in to [data-reveal] elements as they enter the viewport. CSS owns the motion. */
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    window.__fsReveal = true
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in")
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    )
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
