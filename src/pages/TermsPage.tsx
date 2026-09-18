import { Link } from 'react-router-dom'
import { useSEO } from '../lib/seo'
import { BUSINESS_NAME, BUSINESS_HOURS, ADDRESS, EMAIL } from '../lib/business'

const SECTIONS = [
  {
    title: '1. About these terms',
    body: [
      `These Terms of Service govern your use of the ${BUSINESS_NAME} online store and the purchase of products from it. ${BUSINESS_NAME} is the trading name under which the store operates. By placing an order or using the store, you agree to be bound by these terms.`,
    ],
  },
  {
    title: '2. Who can shop',
    body: [
      'You must be at least 18 years old, or have a parent or guardian\u2019s permission, to place an order. You agree to provide accurate, current and complete information when you register and check out.',
    ],
  },
  {
    title: '3. Products and pricing',
    body: [
      'All prices are shown in Ghana Cedis (GH\u20b5) and may change at any time. We make every effort to display product descriptions, images and prices accurately, but minor variations may occur. Product availability is not guaranteed until your order is confirmed.',
    ],
  },
  {
    title: '4. Orders and acceptance',
    body: [
      'Placing an order is an offer to purchase. We reserve the right to accept or decline any order, including where a product is out of stock, a price was listed incorrectly, or we suspect fraud. We may also cancel orders where payment cannot be completed.',
    ],
  },
  {
    title: '5. Payment',
    body: [
      'We accept cash on delivery (pay the delivery courier in cash when your order arrives) and mobile money. Payment is due in full at the time of delivery for cash on delivery orders, or at the time of transfer for mobile money orders.',
    ],
  },
  {
    title: '6. Delivery',
    body: [
      'We deliver across Ghana. Delivery fees and estimated times are shown at checkout. While we aim to meet the indicated delivery windows, delays may occasionally occur due to circumstances outside our control. Delivery is free on orders over the threshold shown on the store, where applicable.',
    ],
  },
  {
    title: '7. Returns and refunds',
    body: [
      'If a product arrives damaged, incorrect or faulty, contact us within the period stated on the store (7 days from delivery) and we will arrange a replacement or refund as appropriate. To be eligible, products must be unused and in their original packaging where possible. Refunds are issued via the original payment method or as agreed with our team.',
    ],
  },
  {
    title: '8. Account responsibilities',
    body: [
      'You are responsible for keeping your account credentials confidential and for all activity under your account. If you believe your account has been compromised, contact us immediately.',
    ],
  },
  {
    title: '9. Intellectual property',
    body: [
      `The ${BUSINESS_NAME} name, logo, product photography and all site content are the property of ${BUSINESS_NAME} or its licensors. You may not reproduce, duplicate or exploit any part of the store for commercial purposes without our written permission.`,
    ],
  },
  {
    title: '10. Limitation of liability',
    body: [
      'To the extent permitted by law, our liability is limited to the value of the products you purchased from us. We are not liable for losses that were not foreseeable, or for indirect or consequential loss arising from use of the store.',
    ],
  },
  {
    title: '11. Governing law',
    body: [
      `These terms are governed by the laws of the Republic of Ghana. Any disputes will be subject to the exclusive jurisdiction of the courts of Ghana.`,
    ],
  },
  {
    title: '12. Contact',
    body: [
      `Questions about these terms? Email ${EMAIL} or write to ${BUSINESS_NAME}, ${ADDRESS}. We\u2019re available ${BUSINESS_HOURS}.`,
    ],
  },
]

export default function TermsPage() {
  useSEO({
    title: 'Terms of Service',
    description:
      'The terms and conditions that apply when you shop with Magen World, including orders, payment, delivery and returns.',
    path: '/terms',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-stone-900">Terms of Service</h1>
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
        By continuing to browse or shop, you accept these terms. See our{' '}
        <Link to="/privacy" className="font-semibold text-emerald-700 hover:underline">
          Privacy Policy
        </Link>{' '}
        for how we handle your information.
      </p>
    </div>
  )
}