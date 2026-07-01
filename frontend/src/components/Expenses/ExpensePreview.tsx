import type { Category } from "./useAddExpense"
import { sectionLabel, theme } from "./voltageTheme"

// Mock data — replace with real API data once ExpensesService exists
const SIMILAR_RECENT = [
  { name: "Blue Bottle", amount: "−$5.40" },
  { name: "Sightglass", amount: "−$6.10" },
  { name: "Verve Coffee", amount: "−$5.75" },
]

const CATEGORY_BUDGET = {
  spent: 612,
  budget: 550,
  label: "Food this month",
}

interface ExpensePreviewProps {
  merchant: string
  amount: string
  category: Category
}

export function ExpensePreview({
  merchant,
  amount,
  category,
}: ExpensePreviewProps) {
  const fillPercent = Math.min(
    100,
    (CATEGORY_BUDGET.spent / CATEGORY_BUDGET.budget) * 100,
  )

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          border: `1px solid ${theme.line}`,
          background: theme.panel,
          padding: 16,
        }}
      >
        <div style={sectionLabel}>Preview</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: merchant ? theme.text : theme.muted,
              }}
            >
              {merchant || "Merchant name"}
            </div>
            <div style={{ marginTop: 5 }}>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: 0.5,
                  border: `1px solid ${theme.accent}`,
                  color: theme.accent,
                  padding: "2px 6px",
                  textTransform: "uppercase",
                }}
              >
                {category}
              </span>
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: amount ? theme.text : theme.muted,
            }}
          >
            {amount ? `−$${amount}` : "—"}
          </div>
        </div>
      </div>

      <div
        style={{
          border: `1px solid ${theme.line}`,
          background: theme.panel,
          padding: 16,
          flex: 1,
        }}
      >
        <div style={sectionLabel}>Similar recent</div>
        {SIMILAR_RECENT.map((transaction, index) => (
          <div
            key={transaction.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom:
                index < SIMILAR_RECENT.length - 1
                  ? `1px solid ${theme.line}`
                  : "none",
              fontSize: 12,
            }}
          >
            <span>{transaction.name}</span>
            <span style={{ color: theme.muted }}>{transaction.amount}</span>
          </div>
        ))}

        <div
          style={{
            marginTop: 14,
            borderTop: `1px solid ${theme.line}`,
            paddingTop: 12,
          }}
        >
          <div
            style={{
              fontSize: 9.5,
              color: theme.muted,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {CATEGORY_BUDGET.label}
          </div>
          <div
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 800,
              fontSize: 20,
              marginTop: 4,
            }}
          >
            ${CATEGORY_BUDGET.spent}{" "}
            <span style={{ fontSize: 11, color: theme.accent2 }}>
              / ${CATEGORY_BUDGET.budget} budget
            </span>
          </div>
          <div
            style={{
              height: 7,
              background: "rgba(255,255,255,0.06)",
              marginTop: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${fillPercent}%`,
                background: theme.accent2,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
