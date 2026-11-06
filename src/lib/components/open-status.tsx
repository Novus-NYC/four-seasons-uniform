"use client"

import { useEffect, useState } from "react"
import { business, formatTime } from "@/lib/business"

type Status = { open: boolean; label: string }

const DAY_INDEX: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }

/** Today's index (Mon = 0) and minutes since midnight, in the shop's time zone. */
export function shopNow(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: business.timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  return { day: DAY_INDEX[get("weekday")] ?? 0, minutes: Number(get("hour")) * 60 + Number(get("minute")) }
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function computeStatus(): Status {
  const { day, minutes } = shopNow()
  const today = business.hours[day]
  if (today.open && today.close && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, label: `Open now until ${formatTime(today.close)}` }
  }
  if (today.open && minutes < toMinutes(today.open)) {
    return { open: false, label: `Closed now. Opens today at ${formatTime(today.open)}` }
  }
  for (let i = 1; i <= 7; i++) {
    const next = business.hours[(day + i) % 7]
    if (next.open) {
      const when = i === 1 ? "tomorrow" : next.day
      return { open: false, label: `Closed now. Opens ${when} at ${formatTime(next.open)}` }
    }
  }
  return { open: false, label: "Closed now" }
}

/** Live open/closed badge. Renders nothing on the server to avoid a hydration mismatch. */
export default function OpenStatus({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    setStatus(computeStatus())
    const id = window.setInterval(() => setStatus(computeStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  if (!status) return <span className="inline-block min-h-[1.5rem]" aria-hidden="true" />

  const text = tone === "dark" ? "text-white" : "text-awning-night"
  return (
    <span className={`inline-flex min-h-[1.5rem] items-center gap-2 text-sm font-semibold ${text}`}>
      <span
        className={`h-2.5 w-2.5 rounded-full ${status.open ? "bg-leaf shadow-[0_0_0_4px_rgb(108_194_74/0.25)]" : "bg-[#9aa3b8]"}`}
        aria-hidden="true"
      />
      {status.label}
    </span>
  )
}
