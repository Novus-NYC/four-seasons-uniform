"use client"

import { useEffect, useState } from "react"
import { business } from "@/lib/business"
import { ArrowIcon } from "./icons"

export default function ContactForm() {
  const [preview, setPreview] = useState(false)
  const [interactive, setInteractive] = useState(false)

  // Keep the preview from falling back to a native GET submission without JS.
  useEffect(() => setInteractive(true), [])
  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault()
        setPreview(true)
      }}
      onChange={() => setPreview(false)}
    >
      <div className="form-row">
        <label htmlFor="contact-name">
          Your name
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="First and last name"
            maxLength={100}
            required
          />
        </label>
        <label htmlFor="contact-email">
          Email address
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={254}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label htmlFor="contact-phone">
          <span>
            Phone <span className="font-normal text-muted">(optional)</span>
          </span>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(718) 555-0123"
            maxLength={30}
          />
        </label>
        <label htmlFor="contact-topic">
          What can we help with?
          <select id="contact-topic" name="topic" defaultValue="" required>
            <option value="" disabled>
              Select a topic
            </option>
            <option>Sizes and availability</option>
            <option>Special orders</option>
            <option>Fitting help</option>
            <option>Something else</option>
          </select>
        </label>
      </div>
      <label htmlFor="contact-message">
        Your message
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Looking for a particular brand, color or size? Let us know."
          maxLength={3000}
          required
        />
      </label>
      <div className="form-bottom">
        <p>This form is a preview. Messages aren&apos;t sent yet.</p>
        <button type="submit" className="btn-plum disabled:opacity-60" disabled={!interactive}>
          Preview message
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {preview && (
          <p className="form-notice">
            Your message is ready, but online delivery isn&apos;t connected yet. Please call{" "}
            <a href={business.phone.href}>{business.phone.display}</a> to reach the shop. Your details have not been
            sent.
          </p>
        )}
      </div>
    </form>
  )
}
