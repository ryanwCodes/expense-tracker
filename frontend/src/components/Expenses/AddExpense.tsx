import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

import { AmountInput } from "./AmountInput"
import { CategoryChips } from "./CategoryChips"
import { ExpensePreview } from "./ExpensePreview"
import { ACCOUNTS, useAddExpense } from "./useAddExpense"
import { label, theme } from "./voltageTheme"

export function AddExpense() {
  const navigate = useNavigate()
  const {
    amount,
    setAmount,
    merchant,
    setMerchant,
    category,
    setCategory,
    date,
    account,
    setAccount,
    note,
    setNote,
    handleSubmit,
  } = useAddExpense()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate({ to: "/" })
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [navigate])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.bg,
        fontFamily: "'JetBrains Mono', monospace",
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      <style>{`
        @keyframes caretBlink {
          0%, 49% { opacity: 1 }
          50%, 100% { opacity: 0 }
        }
      `}</style>

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 54,
          padding: "0 22px",
          borderBottom: `1px solid ${theme.line}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: -0.5,
          }}
        >
          LEDGER<span style={{ color: theme.accent }}>{"///"}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          style={{
            background: "transparent",
            border: "none",
            color: theme.muted,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          New entry · esc to close ✕
        </button>
      </header>

      <div
        style={{
          display: "flex",
          gap: 20,
          padding: 22,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Form panel */}
        <div
          style={{
            flex: 1.5,
            border: `1px solid ${theme.line}`,
            background: theme.panel,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflow: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            NEW EXPENSE
          </div>

          {/* AI quick-parse bar */}
          <div
            style={{
              border: `1px solid ${theme.accent}`,
              padding: "11px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 0 18px rgba(41,231,255,0.2)",
            }}
          >
            <span style={{ fontSize: 13, color: theme.accent }}>⌘</span>
            <input
              type="text"
              placeholder='try: "uber to airport 32.50 transport"'
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: theme.muted,
                fontSize: 12,
                flex: 1,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
            <button
              type="button"
              style={{
                background: "transparent",
                border: "none",
                fontSize: 10,
                letterSpacing: 1,
                color: theme.accent,
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Parse →
            </button>
          </div>

          <AmountInput value={amount} onChange={setAmount} />

          <CategoryChips selected={category} onChange={setCategory} />

          {/* Merchant + Date + Account */}
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                flex: 2,
                border: `1px solid ${theme.line}`,
                padding: "11px 12px",
              }}
            >
              <div style={label}>Merchant</div>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Blue Bottle Coffee"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: merchant ? theme.text : theme.muted,
                  fontSize: 12.5,
                  marginTop: 4,
                  width: "100%",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                border: `1px solid ${theme.line}`,
                padding: "11px 12px",
              }}
            >
              <div style={label}>Date</div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>{date}</div>
            </div>
          </div>

          <div
            style={{ border: `1px solid ${theme.line}`, padding: "11px 12px" }}
          >
            <div style={label}>Account</div>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value as typeof account)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: theme.text,
                fontSize: 12.5,
                marginTop: 4,
                width: "100%",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
              }}
            >
              {ACCOUNTS.map((acct) => (
                <option
                  key={acct}
                  value={acct}
                  style={{ background: theme.panel }}
                >
                  {acct}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{ border: `1px solid ${theme.line}`, padding: "11px 12px" }}
          >
            <div style={label}>Note</div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="oat latte + croissant…"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: note ? theme.text : theme.muted,
                fontSize: 12.5,
                marginTop: 4,
                width: "100%",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              background: "transparent",
              color: theme.accent,
              textAlign: "center",
              padding: 14,
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 1,
              marginTop: "auto",
              border: `1px solid ${theme.accent}`,
              boxShadow: "0 0 18px rgba(41,231,255,0.35)",
              cursor: "pointer",
              textTransform: "uppercase",
              width: "100%",
            }}
          >
            LOG EXPENSE ↵
          </button>
        </div>

        {/* Info panel */}
        <ExpensePreview
          merchant={merchant}
          amount={amount}
          category={category}
        />
      </div>
    </div>
  )
}
