export function EquityBadge({ rentMonthly, buyPrice, tenureMonths = 3, discountMultiplier = 1.0 }) {
  const effectiveRent = Math.round(rentMonthly * discountMultiplier)
  const monthlyEquity = Math.round(effectiveRent * 0.8)
  const totalTenureEquity = monthlyEquity * tenureMonths
  const residualBuyout = Math.max(0, buyPrice - totalTenureEquity)

  return (
    <div className="equity-badge" title="80% of rent paid can be credited toward buyout if you choose to keep it">
      <div className="equity-badge__header">
        <span className="equity-badge__icon" aria-hidden="true">★</span>
        <span className="equity-badge__title">Rent-to-Own Equity</span>
      </div>
      <p className="equity-badge__text">
        <strong className="tabular-nums">₹{monthlyEquity}/mo</strong> credits to buyout. In {tenureMonths} mos, own it for only{' '}
        <strong className="tabular-nums text-accent">₹{residualBuyout}</strong> (orig. ₹{buyPrice}).
      </p>
    </div>
  )
}

