type Props = { className?: string; size?: "sm" | "md" | "lg" }

const sizes = {
  sm: { top: "text-[19px]", bottom: "text-[12px]" },
  md: { top: "text-[22px] lg:text-[25px]", bottom: "text-[13px] lg:text-[14.5px]" },
  lg: { top: "text-[30px]", bottom: "text-[18px]" },
}

/**
 * Text wordmark modeled on the shop's awning: white lettering with a yellow F,
 * an orange-red S, and "Uniform" in green. No formal logo file exists yet.
 */
export default function Wordmark({ className = "", size = "md" }: Props) {
  const s = sizes[size]
  return (
    <span className={`inline-flex flex-col font-display font-black leading-[0.95] tracking-[0.005em] ${className}`}>
      <span className={`${s.top} text-white`}>
        <span className="text-sun">F</span>our <span className="text-[#ee5a2f]">S</span>easons
      </span>
      <span className={`${s.bottom} self-end pr-0.5 text-leaf`}>Uniform</span>
    </span>
  )
}
