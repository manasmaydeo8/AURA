export function ValuePillars({ onOpenCalculator }) {
  const steps = [
    {
      num: '01',
      title: 'Select For Your Space',
      desc: 'Choose from our curated collection of Scandinavian and Japanese inspired residential and office furniture.',
    },
    {
      num: '02',
      title: 'Rent & Live With It',
      desc: 'Delivered and assembled with complimentary white-glove service. Pay small monthly rates with zero debt.',
    },
    {
      num: '03',
      title: 'Feel The Aesthetics',
      desc: 'Experience how materials age, how light reflects off finishes, and how ergonomics support your daily rituals.',
    },
    {
      num: '04',
      title: 'Buy Out With 80% Credit',
      desc: 'Love it? Pay the discounted residual balance with 80% of rent credited. Not right? Return or swap without friction.',
    },
  ]

  return (
    <section className="pillars-section" aria-labelledby="pillars-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">The Rent-to-Own Principle</span>
          <h2 id="pillars-title" className="section-title">A New Standard of Furniture Ownership</h2>
          <p className="section-subtitle">
            Why lock thousands into furniture before knowing how it truly fits your life?
          </p>
        </div>

        <div className="pillars-grid">
          {steps.map((step) => (
            <div key={step.num} className="pillar-card">
              <span className="pillar-num font-mono">{step.num}</span>
              <h3 className="pillar-title">{step.title}</h3>
              <p className="pillar-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="pillars-callout-box">
          <div className="callout-content">
            <span className="callout-tag">Transparent Equity Formula</span>
            <p className="callout-text">
              Rent ₹50/mo for 6 months = ₹300 paid. <strong>₹240 is credited toward the buyout</strong>. You pay only the remaining balance to own it forever.
            </p>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onOpenCalculator}
          >
            Calculate Your Savings →
          </button>
        </div>
      </div>
    </section>
  )
}

