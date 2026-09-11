'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function fire(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

/**
 * Mounts once on the landing page. Fires the required PPC engagement events
 * from Phase 6 of the landing-page-builder skill:
 *   cta_click, scroll_75, engaged_session, form_start
 * Also captures gclid/UTM params into sessionStorage so they can be read
 * back into hidden form fields before submission.
 */
export default function EventTracking() {
  useEffect(() => {
    // Capture gclid + UTM params for attribution on submit.
    const params = new URLSearchParams(window.location.search)
    const toStore = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    toStore.forEach((key) => {
      const value = params.get(key)
      if (value) sessionStorage.setItem(key, value)

      // Populate the matching hidden form field, falling back to a value
      // stored from an earlier page view in this session (e.g. after a
      // client-side navigation that dropped the query string).
      const stored = value ?? sessionStorage.getItem(key)
      const field = document.getElementById(key) as HTMLInputElement | null
      if (field && stored) field.value = stored
    })

    // cta_click — any element with data-cta
    const ctaHandler = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest('[data-cta]')
      if (target) {
        fire('cta_click', { cta_location: target.getAttribute('data-cta') })
      }
    }
    document.addEventListener('click', ctaHandler)

    // scroll_75 — fire once
    let scrollFired = false
    const scrollHandler = () => {
      if (scrollFired) return
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (total > 0 && scrolled / total >= 0.75) {
        scrollFired = true
        fire('scroll_75')
        window.removeEventListener('scroll', scrollHandler)
      }
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })

    // engaged_session — fire once after 60s
    const engagedTimer = setTimeout(() => fire('engaged_session'), 60000)

    // form_start — first focus on any form field
    let formStarted = false
    const formHandler = (e: Event) => {
      if (formStarted) return
      const target = e.target as HTMLElement
      if (target?.closest('form')) {
        formStarted = true
        fire('form_start')
      }
    }
    document.addEventListener('focusin', formHandler)

    return () => {
      document.removeEventListener('click', ctaHandler)
      window.removeEventListener('scroll', scrollHandler)
      document.removeEventListener('focusin', formHandler)
      clearTimeout(engagedTimer)
    }
  }, [])

  return null
}
