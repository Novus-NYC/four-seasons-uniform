import Link from "next/link"
import { business } from "@/lib/business"
import SceneSvg from "./scene-svg"
import StoryStage from "./story-stage"
import { SNAPSHOT_T, computeFrame } from "./scene"

type Chapter = {
  step: string
  eyebrow: string
  title: string
  body: string
  cta?: { href: string; label: string; external?: boolean }
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

const chapters: Chapter[] = [
  {
    step: "Colors",
    eyebrow: "Colors and styles",
    title: "Find your color on the rack.",
    body: "Brand-name scrub tops, pants, sets and jackets in solid colors and prints. Navy, ceil blue, teal, wine and plenty more, in women's, men's and unisex cuts.",
  },
  {
    step: "Fit",
    eyebrow: "Fitting help",
    title: "Petite, tall or expecting? We'll help you find the fit.",
    body: "Ask our staff. They'll help you choose the right size and cut for your body, with petite, tall and maternity-friendly options in the store.",
  },
  {
    step: "Special orders",
    eyebrow: "Special orders",
    title: business.specialOrders.headline,
    body: `${business.specialOrders.body} ${business.specialOrders.terms.join(". ")}.`,
    cta: { href: business.phone.href, label: `Call ${business.phone.display}` },
  },
  {
    step: "Visit",
    eyebrow: "Visit the shop",
    title: "Find us under the 7 train.",
    body: `${business.address.streetLong} in ${business.address.city}, ${lowerFirst(business.address.crossStreets)}. Open ${business.hoursSummary}.`,
    cta: { href: business.directions.google, label: "Get directions", external: true },
  },
]

export default function ScrollStory() {
  return (
    <section className="story relative bg-white" aria-label="Shopping at Four Seasons Uniform">
      {/* Live, pinned stage. Hidden by CSS unless JS runs and motion is allowed. */}
      <div className="story-stage-wrap" aria-hidden="true">
        <div className="mx-auto h-full w-full max-w-site lg:px-8">
          <div className="story-stage-box lg:ml-auto lg:w-[56%] lg:py-6">
            <div className="relative h-full overflow-hidden border-b border-line bg-awning-mist lg:rounded-card lg:border">
              <StoryStage steps={chapters.map((c) => c.step)} />
            </div>
          </div>
        </div>
      </div>

      <div className="story-chapters container-site">
        {chapters.map((c, i) => (
          <article
            key={c.step}
            className="story-chapter grid items-center gap-6 border-t border-line py-12 first:border-t-0 sm:gap-10 lg:grid-cols-[1fr_1.15fr] lg:py-16"
          >
            <div className="story-copy">
              <p className="eyebrow text-ember">
                <span className="mr-2 text-awning">{i + 1}</span>
                {c.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-[1.65rem] font-extrabold leading-[1.15] text-awning-night sm:text-3xl lg:text-[2.35rem]">
                {c.title}
              </h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-muted lg:mt-4 lg:text-lg">{c.body}</p>
              {c.cta && (
                <p className="mt-5">
                  <Link
                    href={c.cta.href}
                    className="btn-blue"
                    {...(c.cta.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {c.cta.label}
                  </Link>
                </p>
              )}
            </div>
            <div className="story-snapshot" aria-hidden="true">
              <div className="aspect-square overflow-hidden rounded-card border border-line bg-awning-mist">
                <SceneSvg frame={computeFrame(SNAPSHOT_T[i])} id={`story-snap-${i}`} className="h-full w-full" />
              </div>
            </div>
          </article>
        ))}
        <div className="story-tail" aria-hidden="true" />
      </div>
    </section>
  )
}
