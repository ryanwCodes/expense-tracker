export const theme = {
  bg: "#06090F",
  panel: "#0B0F16",
  line: "#18222F",
  text: "#E6EDF5",
  muted: "#5C6E82",
  accent: "#29E7FF",
  accent2: "#C6FF3A",
} as const

export const label: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: 1,
  color: theme.muted,
  textTransform: "uppercase",
}

export const sectionLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 1.5,
  color: theme.muted,
  textTransform: "uppercase",
}
