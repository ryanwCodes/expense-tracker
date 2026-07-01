import { useState } from "react"

export const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Fun",
  "Other",
] as const

export const ACCOUNTS = [
  "Amex Gold",
  "Chase Sapphire",
  "Bank of America",
  "Cash",
] as const

export type Category = (typeof CATEGORIES)[number]
export type Account = (typeof ACCOUNTS)[number]

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function useAddExpense() {
  const [amount, setAmount] = useState("")
  const [merchant, setMerchant] = useState("")
  const [category, setCategory] = useState<Category>("Food & Drink")
  const [date] = useState(formatDate(new Date()))
  const [account, setAccount] = useState<Account>("Amex Gold")
  const [note, setNote] = useState("")

  function handleSubmit() {
    // TODO: wire up to ItemsService or a dedicated ExpensesService
    console.log({ amount, merchant, category, date, account, note })
  }

  return {
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
  }
}
