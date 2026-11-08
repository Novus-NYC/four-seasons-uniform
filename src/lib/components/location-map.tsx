import { business, fullAddress } from "@/lib/business"
import { ArrowIcon, PinIcon } from "./icons"

export default function LocationMap() {
  const query = encodeURIComponent(`${business.name}, ${fullAddress}`)
  return (
    <div className="location-map">
      <iframe
        title={`Google Maps: ${business.name} at ${business.address.street}`}
        src={`https://www.google.com/maps?q=${query}&z=16&output=embed`}
        width="600"
        height="400"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[340px] w-full border-0 sm:h-[390px]"
      />
      <a href={business.directions.google} target="_blank" rel="noreferrer" className="map-address">
        <PinIcon className="h-5 w-5 shrink-0" />
        <span>
          <strong>{business.address.street}</strong>
          <span>
            {business.address.city}, {business.address.region} {business.address.postalCode}
          </span>
        </span>
        <ArrowIcon className="ml-auto h-5 w-5 shrink-0" />
      </a>
    </div>
  )
}
