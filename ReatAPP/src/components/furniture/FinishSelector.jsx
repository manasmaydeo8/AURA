import { LayoutGroup, motion } from 'motion/react'

export function FinishSelector({ finishes, selectedFinish, onSelectFinish, layoutGroupPrefix = 'finish' }) {
  if (!finishes || finishes.length === 0) {
    return null
  }

  return (
    <div className="finish-selector-container">
      <span className="finish-selector-label">Finish / Material</span>
      <LayoutGroup id={`${layoutGroupPrefix}-${finishes[0]?.id || 'fg'}`}>
        <div className="finish-options" role="radiogroup" aria-label="Choose furniture finish">
          {finishes.map((finish) => {
            const active = selectedFinish?.id === finish.id

            return (
              <button
                key={finish.id}
                type="button"
                role="radio"
                aria-checked={active}
                title={finish.name}
                onClick={() => onSelectFinish(finish)}
                className={`finish-option-pill ${active ? 'finish-option-pill--active' : ''}`}
              >
                {active && (
                  <motion.span
                    layoutId={`${layoutGroupPrefix}-active-indicator`}
                    className="finish-option-indicator"
                    transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                  />
                )}
                <span
                  className="finish-swatch-dot"
                  style={{ backgroundColor: finish.color }}
                  aria-hidden="true"
                />
                <span className="finish-name-text">{finish.name}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>
    </div>
  )
}

