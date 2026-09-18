import { useSEO } from '../lib/seo'
import { BUSINESS_NAME, BUSINESS_HOURS, ADDRESS, EMAIL } from '../lib/business'

const SECTIONS = [
  {
    title: '1. Information we collect',
    body: [
      `When you use ${BUSINESS_NAME}, we collect information you provide directly (such as your name, delivery address, phone number, email address and order details), and information gathered automatically (such as device type, pages visited and basic usage analytics, when you have consented to analytics cookies).`,
    ],
  },
  {
    title: '2. How we use your information',
    body: [
      `We use your information to process and deliver your orders, confirm payment details (cash on delivery or mobile money), respond to enquiries, improve our store, and send order-related updates. Where you have subscribed to messages with your consent, we may occasionally send promotional offers you can opt out of at any time.`,
    ],
  },
  {
    title: '3. Legal basis for processing',
    body: [
      'We process personal data on the basis of contract performance (to fulfil your orders), legitimate interest (to operate and improve our store), and consent (for analytics and marketing, which you may withdraw at any time).',
    ],
  },
  {
    title: '4. Payment information',
    body: [
      'We accept cash on delivery and mobile money. Mobile money payments are processed by licensed payment service providers; we do not store your full payment credentials such as PINs. Any payment information you provide is handled by the relevant provider under its own privacy terms.',
    ],
  },
  {
    title: '5. Cookies and analytics',
    body: [
      'Our site uses essential cookies to keep the store functional (for example, remembering your cart and sign-in session). If you accept analytics cookies, we use privacy-respecting analytics to understand aggregate usage. You can accept or decline analytics cookies using the consent banner, and you can change your choice by clearing your browser cookies.',
    ],
  },
  {
    title: '6. Sharing your information',
    body: [
      'We do not sell your personal information. We share information only with providers that help us run the store (hosting, order management and payment processing) and only to the extent needed to provide those services, under agreements that protect your information.',
    ],
  },
  {
    title: '7. Data retention',
    body: [
      'We keep your account and order records for as long as your account is active or as needed to provide services, comply with legal obligations and resolve disputes. When you request deletion, we remove or anonymise your personal data where we are not required by law to keep it.',
    ],
  },
  {
    title: '8. Your rights',
    body: [
      'You have the right to access, correct, export or delete the personal information we hold about you, and to withdraw any consent you have given. To exercise these rights, contact us using the details below. We will respond within a reasonable period.',
    ],
  },
  {
    title: '9. Children\u2019s privacy',
    body: [
      'Our store is intended for customers who can lawfully enter into a purchase with us. We do not knowingly collect personal data from children under the age of 13.',
    ],
  },
  {
    title: '10. Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. We will post any changes on this page and update the revision date below. Continued use of the store after changes means you accept the updated policy.',
    ],
  },
  {
    title: '11. Contact us',
    body: [
      `For questions about this policy or your personal data, email ${EMAIL} or write to ${BUSINESS_NAME}, ${ADDRESS}.`,
    ],
  },
]

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy',
    description:
      'How Magen World collects, uses and protects your personal information when you shop with us.',
    path: '/privacy',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-stone-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone-500">
        Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-lg font-bold text-stone-900">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-sm leading-relaxed text-stone-600">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
        Questions? Contact{' '}
        <a href={`mailto:${EMAIL}`} className="font-semibold text-emerald-700 hover:underline">
          {EMAIL}
        </a>
        . Our store is available {BUSINESS_HOURS}.
      </p>
    </div>
  )
}