type IconProps = { className?: string }

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
}

export const PhoneIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 4h3.2l1.6 4-2.1 1.3a11 11 0 0 0 7 7l1.3-2.1 4 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
)

export const PinIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const ClockIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const ArrowIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const StarIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"
    />
  </svg>
)

export const MenuIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const CheckIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2.4}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </svg>
)

export const TrainIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="5" y="3" width="14" height="14" rx="3" />
    <path d="M5 10h14M8.5 21l1.5-4M15.5 21 14 17" />
    <circle cx="9" cy="13.5" r="0.6" fill="currentColor" />
    <circle cx="15" cy="13.5" r="0.6" fill="currentColor" />
  </svg>
)

/** Five stars filled to the rating (e.g. 4.3). Decorative; the number is always shown as text. */
export const Stars = ({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) => {
  const row = (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} className={`${className} shrink-0`} />
      ))}
    </>
  )
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <span className="flex text-current opacity-25">{row}</span>
      <span className="absolute inset-y-0 left-0 flex overflow-hidden text-sun" style={{ width: `${(rating / 5) * 100}%` }}>
        {row}
      </span>
    </span>
  )
}
