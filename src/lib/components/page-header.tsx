import { business } from "@/lib/business"

type Props = {
  eyebrow: string
  title: string
  lead: string
  children?: React.ReactNode
  aside?: React.ReactNode
}

/** Subpage opener. Continues the awning blue from the navbar and ends on the awning's white rule. */
export default function PageHeader({ eyebrow, title, lead, children, aside }: Props) {
  return (
    <section className="on-dark bg-awning text-white">
      <div className={`container-site grid gap-10 pb-12 pt-10 lg:pb-16 lg:pt-16 ${aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-end" : ""}`}>
        <div>
          <p className="eyebrow rise text-sun">{eyebrow}</p>
          <h1
            className="rise mt-4 max-w-3xl font-display text-[2.5rem] font-black leading-[1.04] sm:text-5xl lg:text-[3.75rem]"
            style={{ "--d": "70ms" } as React.CSSProperties}
          >
            {title}
          </h1>
          <p className="rise mt-5 max-w-2xl text-lg leading-relaxed text-white/85" style={{ "--d": "140ms" } as React.CSSProperties}>
            {lead}
          </p>
          {children && (
            <div className="rise mt-8" style={{ "--d": "210ms" } as React.CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {aside}
      </div>
      <div className="container-site">
        <div className="awning-rule" />
        <p className="py-3.5 text-sm font-bold tracking-wide text-sun">
          {business.address.street}. {business.address.neighborhood}
        </p>
      </div>
    </section>
  )
}
