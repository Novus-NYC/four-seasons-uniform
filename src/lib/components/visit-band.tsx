import { business } from "@/lib/business"
import OpenStatus from "./open-status"
import { ClockIcon, PhoneIcon, PinIcon, TrainIcon } from "./icons"

type Props = { title?: string; lead?: string }

/** Closing call to action used at the end of every page. */
export default function VisitBand({
  title = "Come see us on Roosevelt Avenue.",
  lead = "Walk in for scrubs, shoes and fitting help. Call ahead if you'd like us to check for your size.",
}: Props) {
  return (
    <section className="on-dark bg-awning text-white" aria-labelledby="visit-band-title">
      <div className="container-site grid gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-24">
        <div data-reveal>
          <p className="eyebrow text-sun">Visit the shop</p>
          <h2 id="visit-band-title" className="mt-4 font-display text-4xl font-black leading-[1.05] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{lead}</p>
          <div className="mt-6">
            <OpenStatus tone="dark" />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={business.directions.google} target="_blank" rel="noreferrer" className="btn-sun">
              <PinIcon className="h-[18px] w-[18px]" />
              Get directions
            </a>
            <a href={business.phone.href} className="btn-ghost-light">
              <PhoneIcon className="h-[18px] w-[18px]" />
              Call {business.phone.display}
            </a>
          </div>
        </div>

        <dl data-reveal style={{ "--d": "120ms" } as React.CSSProperties} className="grid gap-px overflow-hidden rounded-card bg-white/15">
          <div className="flex gap-4 bg-awning-deep p-5 sm:p-6">
            <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-sun" />
            <div>
              <dt className="font-semibold">{business.address.street}</dt>
              <dd className="mt-1 text-white/80">
                {business.address.city}, {business.address.region} {business.address.postalCode}. {business.address.crossStreets}.
              </dd>
            </div>
          </div>
          <div className="flex gap-4 bg-awning-deep p-5 sm:p-6">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-sun" />
            <div>
              <dt className="font-semibold">{business.hoursSummary}</dt>
              <dd className="mt-1 text-white/80">
                {business.closedSummary}. {business.holidayNote}
              </dd>
            </div>
          </div>
          <div className="flex gap-4 bg-awning-deep p-5 sm:p-6">
            <TrainIcon className="mt-0.5 h-5 w-5 shrink-0 text-sun" />
            <div>
              <dt className="font-semibold">Under the 7 train</dt>
              <dd className="mt-1 text-white/80">
                {business.transit.note}: {business.transit.station} ({business.transit.lines.join(", ")}).
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  )
}
