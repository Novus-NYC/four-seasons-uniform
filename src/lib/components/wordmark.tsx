type Props = { className?: string; size?: "sm" | "md" | "lg" }

export default function Wordmark({ className = "", size = "md" }: Props) {
  return (
    <span className={`wordmark wordmark-${size} ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="wordmark-symbol">
        <path d="M20 20C-2 20 3 1 13 5c5 2 7 9 7 15Z" fill="currentColor" />
        <path d="M20 20C20-2 39 3 35 13c-2 5-9 7-15 7Z" fill="#edb63b" />
        <path d="M20 20c22 0 17 19 7 15-5-2-7-9-7-15Z" fill="currentColor" />
        <path d="M20 20c0 22-19 17-15 7 2-5 9-7 15-7Z" fill="#91a57a" />
      </svg>
      <span className="flex flex-col">
        <span className="wordmark-name">Four Seasons</span>
        <span className="wordmark-caption">Uniforms for the everyday</span>
      </span>
    </span>
  )
}
