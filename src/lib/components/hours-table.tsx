"use client"

import { useEffect, useState } from "react"
import { business, formatTime } from "@/lib/business"
import { shopNow } from "./open-status"

type Props = { tone?: "light" | "dark"; className?: string }

/** Weekly hours. Today's row is highlighted after hydration (shop time zone). */
export default function HoursTable({ tone = "light", className = "" }: Props) {
  const [today, setToday] = useState<number | null>(null)
  useEffect(() => setToday(shopNow().day), [])

  const dark = tone === "dark"
  return (
    <table className={`w-full border-collapse text-[15px] ${className}`}>
      <caption className="sr-only">Store hours</caption>
      <tbody>
        {business.hours.map((h, i) => {
          const isToday = i === today
          return (
            <tr
              key={h.day}
              className={`border-b ${dark ? "border-white/15" : "border-line"} ${
                isToday ? (dark ? "bg-white/10" : "bg-sun-soft") : ""
              }`}
            >
              <th scope="row" className="py-2.5 pl-2 pr-4 text-left font-semibold">
                {h.day}
                {isToday && <span className={`ml-2 text-xs font-bold uppercase tracking-wider ${dark ? "text-sun" : "text-awning"}`}>Today</span>}
              </th>
              <td className={`py-2.5 pr-2 text-right tabular-nums ${dark ? "text-white/85" : "text-muted"}`}>
                {h.open && h.close ? `${formatTime(h.open)} to ${formatTime(h.close)}` : "Closed"}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
