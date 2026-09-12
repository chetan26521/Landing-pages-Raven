export default function Footer() {
  const abn = process.env.NEXT_PUBLIC_BUSINESS_ABN || '[[ABN]]'
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || '[[EMAIL]]'
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '[[PHONE]]'
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-8 mb-8">
          <div>
            <div className="inline-block bg-white rounded-lg px-3 py-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
              <img src="/logos/raven-labs-logo.png" alt="Raven Labs" width={106} height={36} />
            </div>
            <p className="text-gray-400 max-w-md">
              Raven Labs — Australian technology and automation consultancy. Melbourne HQ, delivering
              nationally.
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="https://theravenlabs.com/about/" className="hover:text-white">About</a>
              </li>
              <li>
                <a href="https://theravenlabs.com/case-studies/" className="hover:text-white">Case Studies</a>
              </li>
              <li>
                <a href="https://theravenlabs.com/contact/" className="hover:text-white">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="https://theravenlabs.com/privacy-policy/" className="hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="https://theravenlabs.com/terms/" className="hover:text-white">Terms &amp; Conditions</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-wrap justify-between gap-4 text-sm text-gray-400">
          {/* Sourced from NEXT_PUBLIC_BUSINESS_ABN/EMAIL/PHONE — required by Google Ads' "Adequate Information" policy. */}
          <div>© {new Date().getFullYear()} Raven Labs Pty Ltd. ABN {abn}. All rights reserved.</div>
          <div>
            Melbourne, VIC · <a href={`mailto:${email}`} className="hover:text-white">{email}</a> · {phone}
          </div>
        </div>
      </div>
    </footer>
  )
}
