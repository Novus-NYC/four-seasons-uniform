import Link from "next/link"
import { business, fullAddress, nav } from "@/lib/business"
import Wordmark from "./wordmark"
import HoursTable from "./hours-table"

export default function Footer() {
  return (
    <footer className="on-dark bg-awning-night text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:py-20">
        <div>
          <Link href="/" className="inline-block rounded" aria-label={`${business.name}, home`}>
            <Wordmark size="lg" />
          </Link>
          <p className="mt-5 max-w-sm leading-relaxed text-white/75">
            Scrubs, lab coats, work shoes and uniforms on Roosevelt Avenue in {business.address.neighborhood}, for{" "}
            {business.yearsLabel}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-semibold">
            {[{ href: "/", label: "Home" }, ...nav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1 text-white/90 underline-offset-4 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-sun">Visit</h2>
          <address className="mt-4 not-italic leading-relaxed">
            <span className="block font-semibold">{business.address.street}</span>
            <span className="block text-white/80">
              {business.address.city}, {business.address.region} {business.address.postalCode}
            </span>
            <span className="mt-1 block text-white/65">{business.address.crossStreets}</span>
          </address>
          <p className="mt-4 flex flex-col gap-2">
            <a href={business.directions.google} target="_blank" rel="noreferrer" className="font-semibold text-sun underline-offset-4 hover:underline">
              Get directions
            </a>
            <a href={business.phone.href} className="font-semibold text-white underline-offset-4 hover:underline">
              {business.phone.display}
            </a>
            <a href={business.social.facebook} target="_blank" rel="noreferrer" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              Facebook
            </a>
          </p>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="eyebrow text-sun">Hours</h2>
          <HoursTable tone="dark" className="mt-2" />
          <p className="mt-3 text-sm text-white/60">{business.holidayNote}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name}. {fullAddress}.
          </p>
          <Link href="https://novusnyc.org" target="_blank" rel="noreferrer" className="font-semibold text-[#F6B78D] hover:underline">
            Made by Novus
          </Link>
        </div>
      </div>
    </footer>
  )
}
