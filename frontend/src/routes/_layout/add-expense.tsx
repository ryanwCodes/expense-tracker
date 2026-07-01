import { createFileRoute } from "@tanstack/react-router"

import { AddExpense } from "@/components/Expenses/AddExpense"

export const Route = createFileRoute("/_layout/add-expense")({
  component: AddExpense,
  head: () => ({
    meta: [{ title: "Add Expense - Ledger" }],
  }),
})
