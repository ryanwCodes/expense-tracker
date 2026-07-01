import { CATEGORIES, type Category } from "./useAddExpense"
import { sectionLabel, theme } from "./voltageTheme"

interface CategoryChipsProps {
  selected: Category
  onChange: (category: Category) => void
}

export function CategoryChips({ selected, onChange }: CategoryChipsProps) {
  return (
    <div>
      <div style={{ ...sectionLabel, marginBottom: 9 }}>Category</div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          fontSize: 11,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {CATEGORIES.map((category) => {
          const isSelected = category === selected
          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              style={{
                background: "transparent",
                border: `1px solid ${isSelected ? theme.accent : theme.line}`,
                color: isSelected ? theme.accent : theme.text,
                padding: "7px 12px",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                boxShadow: isSelected
                  ? "0 0 14px rgba(41,231,255,0.3)"
                  : "none",
                transition: "all 0.15s",
              }}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
