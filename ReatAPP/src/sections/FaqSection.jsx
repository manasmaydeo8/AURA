import { useState } from 'react'

export function FaqSection({ onOpenCalculator }) {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: 'How does the 80% rent-to-own buyout credit work?',
      a: 'For every month you pay rent on any piece of furniture, 80% of that payment is permanently credited toward the outright retail purchase price. For example, if you rent an ₹890 chair at ₹48/month for 6 months (₹288 total paid), ₹230.40 is credited toward the retail price. You can buy out the chair anytime for just ₹659.60.',
    },
    {
      q: 'What if I decide the furniture doesn’t fit my aesthetic after renting?',
      a: 'That is the entire purpose of AURA. If the piece doesn’t suit your room lighting, space proportion, or workflow, simply schedule a complimentary pickup. We inspect and revitalize the furniture for our circular program, and you have zero further obligation.',
    },
    {
      q: 'Is there a difference between the Rental collection and Buying showroom?',
      a: 'Both listing sections feature our exact same heirloom-quality pieces. The Rental section lets you choose flexible tenures (3, 6, 12 months) and monthly billing with accrued buyout equity. The Buying showroom is designed for those ready to make an immediate permanent acquisition with a 5-year structural warranty.',
    },
    {
      q: 'How does white-glove delivery and assembly work?',
      a: 'Every order—whether rental or purchase—includes complimentary white-glove delivery. Our two-person installation team carries the pieces into your room of choice, unboxes, performs all assembly, checks level and stability, and removes all packaging materials.',
    },
    {
      q: 'Can I swap my rental piece for another color finish or model?',
      a: 'Yes. After your initial 3-month rental period, you can request an aesthetic swap. Your accrued equity can even be transferred over to your new selection.',
    },
  ]

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="container">
        <div className="faq-layout">
          <div className="faq-sidebar">
            <span className="section-eyebrow">Clarity & Confidence</span>
            <h2 id="faq-title" className="section-title">Frequently Asked Questions</h2>
            <p className="faq-sidebar-copy">
              Everything you need to know about our rent-to-own equity model, delivery, and condition standards.
            </p>
            <div className="faq-calc-cta">
              <strong>Curious about your numbers?</strong>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={onOpenCalculator}
              >
                Open Equity Calculator
              </button>
            </div>
          </div>

          <div className="faq-accordion-col" role="region" aria-label="FAQ Accordion">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx

              return (
                <div key={faq.q} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

