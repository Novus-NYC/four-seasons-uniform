"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { business, nav } from "@/lib/business"
import Wordmark from "./wordmark"
import { CloseIcon, MenuIcon, PhoneIcon, PinIcon } from "./icons"

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close on route change.
  useEffect(() => setOpen(false), [pathname])

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    document.documentElement.style.overflow = "hidden"
    panel?.querySelector<HTMLElement>("a, button")?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close()
      if (e.key !== "Tab" || !panel) return
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>("a, button"))
      const all = [buttonRef.current, ...focusables].filter(Boolean) as HTMLElement[]
      const first = all[0]
      const last = all[all.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1024 && close(false)
    document.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      document.documentElement.style.overflow = ""
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [open, close])

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header
      className={`site-nav sticky top-0 z-50 border-b border-line bg-paper text-awning-night transition-shadow duration-300 ${
        scrolled || open ? "shadow-[0_6px_20px_-8px_rgb(46_32_40/0.12)]" : ""
      }`}
    >
      <nav aria-label="Main" className="container-site flex h-[var(--nav-h)] items-center justify-between gap-4">
        <Link href="/" className="-ml-1 rounded px-1 py-1" aria-label={`${business.name}, home`}>
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="relative rounded-md px-3.5 py-2 text-[15px] font-semibold text-muted transition-colors hover:text-awning aria-[current=page]:text-awning"
              >
                {item.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-full bg-sun transition-transform duration-300 ${
                    isActive(item.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
          <li className="ml-3">
            <a href={business.phone.href} className="btn-plum min-h-[44px] py-2.5">
              <PhoneIcon className="h-[18px] w-[18px]" />
              {business.phone.display}
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-1.5 lg:hidden">
          <a
            href={business.phone.href}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-sun text-awning-night"
            aria-label={`Call ${business.phone.display}`}
          >
            <PhoneIcon />
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="js-only inline-flex h-11 w-11 items-center justify-center rounded-lg text-awning-night hover:bg-awning/5"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Without JavaScript the menu button cannot open, so phones get a plain link row. */}
      <ul className="nojs-only container-site flex-wrap gap-x-5 gap-y-1 border-t border-line py-2 text-[15px] font-semibold lg:hidden">
        {nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="inline-block py-2">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <div className="container-site flex min-h-full flex-col py-6">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...nav].map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center justify-between py-4 font-display text-2xl font-extrabold aria-[current=page]:text-awning"
                  onClick={() => close(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-1 text-muted">
            <p className="font-semibold text-awning-night">{business.address.street}</p>
            <p>
              {business.address.city}, {business.address.region} {business.address.postalCode}
            </p>
            <p className="pt-2">{business.hoursSummaryShort}</p>
            <p>{business.closedSummary}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 pb-4">
            <a href={business.phone.href} className="btn-sun">
              <PhoneIcon className="h-[18px] w-[18px]" />
              Call
            </a>
            <a href={business.directions.google} target="_blank" rel="noreferrer" className="btn-ghost">
              <PinIcon className="h-[18px] w-[18px]" />
              Directions
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
