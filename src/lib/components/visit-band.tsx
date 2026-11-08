import { business } from "@/lib/business"
import OpenStatus from "./open-status"
import LocationMap from "./location-map"
import { PhoneIcon, PinIcon } from "./icons"

type Props = { title?: string; lead?: string }

export default function VisitBand({
  title = "A real shop. Right around the corner.",
  lead = "Come try it on. Explore the racks, find your color and get a little help with the fit. We've got you from here.",
}: Props) {
  return (
    <section className="visit-section" aria-labelledby="visit-band-title">
      <div className="container-site grid items-center gap-10 py-16 lg:grid-cols-[.95fr_1.05fr] lg:gap-20 lg:py-24">
        <div>
          <p className="section-kicker">
            <PinIcon className="h-4 w-4" />
            Come on over
          </p>
          <h2 id="visit-band-title" className="mt-4 font-display text-5xl font-bold leading-[.98] sm:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">{lead}</p>
          <div className="mt-6">
            <OpenStatus />
          </div>
          <dl className="visit-details">
            <div>
              <dt>Find us</dt>
              <dd>
                {business.address.street}
                <br />
                {business.address.city}, NY {business.address.postalCode}
              </dd>
            </div>
            <div>
              <dt>Stop by</dt>
              <dd>
                Monday–Saturday
                <br />
                10:30 AM–7:30 PM
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted">
            Under the 7 train, a short walk from 74 St–Broadway. Closed Sunday. {business.holidayNote}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={business.directions.google} target="_blank" rel="noreferrer" className="btn-plum">
              <PinIcon className="h-[18px] w-[18px]" />
              Get directions
            </a>
            <a href={business.phone.href} className="btn-ghost">
              <PhoneIcon className="h-[18px] w-[18px]" />
              {business.phone.display}
            </a>
          </div>
        </div>
        <LocationMap />
      </div>
    </section>
  )
}
