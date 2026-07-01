import { sectionLabel, theme } from "./voltageTheme"

interface AmountInputProps {
  value: string
  onChange: (value: string) => void
}

export function AmountInput({ value, onChange }: AmountInputProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "14px 0",
        borderTop: `1px solid ${theme.line}`,
        borderBottom: `1px solid ${theme.line}`,
      }}
    >
      <div style={sectionLabel}>Amount</div>
      <div
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 900,
          fontSize: 56,
          lineHeight: 1,
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          color: theme.accent,
          textShadow: "0 0 24px rgba(41,231,255,0.5)",
        }}
      >
        $
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: theme.accent,
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 56,
            width: `${Math.max(4, value.length + 1)}ch`,
            textShadow: "0 0 24px rgba(41,231,255,0.5)",
            caretColor: "transparent",
          }}
        />
        <span
          style={{
            display: "inline-block",
            width: 4,
            height: 46,
            background: theme.accent,
            marginLeft: 4,
            animation: "caretBlink 1s steps(1) infinite",
          }}
        />
      </div>
    </div>
  )
}
