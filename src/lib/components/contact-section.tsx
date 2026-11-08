import { business } from "@/lib/business"
import ContactForm from "./contact-form"
import { PhoneIcon } from "./icons"

export default function ContactSection() {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="container-site grid gap-10 py-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:py-24">
        <div>
          <p className="section-kicker">A little help goes a long way</p>
          <h2 id="contact-title" className="mt-4 font-display text-5xl font-bold leading-[.98] sm:text-6xl">
            Let&apos;s find
            <br />
            your fit.
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted">
            A question about a size? Something special in mind? We&apos;re here to help you get ready for your next
            shift.
          </p>
          <a className="contact-phone" href={business.phone.href}>
            <PhoneIcon className="h-5 w-5" />
            <span>
              <span>Prefer a conversation?</span>
              <strong>{business.phone.display}</strong>
            </span>
          </a>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
