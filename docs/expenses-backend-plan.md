# Expenses Backend Plan

Derived from the mock data/UI already built in `frontend/src/components/Expenses/`
(`useAddExpense.ts`, `AddExpense.tsx`, `ExpensePreview.tsx`). This is a design doc, not
code — implement it yourself following the existing `Item` model/route as your template
(`backend/app/models.py`, `backend/app/crud.py`, `backend/app/api/routes/items.py`).

## What the mock data implies

| Field | Source | Notes |
|---|---|---|
| `amount` | `AmountInput` | free-text decimal string, always an outflow (shown as `−$X`) |
| `merchant` | text input | free text, no fixed list |
| `category` | `CategoryChips` | fixed set of 7: Food & Drink, Transport, Shopping, Bills, Health, Fun, Other |
| `date` | defaults to today | currently not editable in the UI, but the field exists |
| `account` | `<select>` | fixed mock list: Amex Gold, Chase Sapphire, Bank of America, Cash — but conceptually a "which card/account did this come from" per user |
| `note` | text input | optional free text |

`ExpensePreview.tsx` also mocks two features worth designing for even if you build them
second: **"Similar recent"** (last few expenses with a similar merchant name) and a
**category budget bar** (spent vs. budget for the current month, per category).

## Tables

Follow the existing `Item` pattern: UUID PK, `owner_id` FK to `user.id` with
`ondelete="CASCADE"`, `created_at` via `get_datetime_utc`.

### `Account`

Users manage their own list of cards/accounts rather than a hardcoded enum — this gives
you a real one-to-many relationship to practice (and matches how the mock `ACCOUNTS`
list is really per-user data, not a global constant).

- `id: uuid.UUID` (PK)
- `owner_id: uuid.UUID` (FK → `user.id`, cascade delete)
- `name: str` (e.g. "Amex Gold")
- `created_at: datetime`

### `Expense`

- `id: uuid.UUID` (PK)
- `owner_id: uuid.UUID` (FK → `user.id`, cascade delete)
- `account_id: uuid.UUID` (FK → `account.id`, cascade delete)
- `amount: Decimal` — use `Decimal` with `sa_column=Column(Numeric(10, 2))`, **not**
  `float`. Money should never be a float.
- `merchant: str` (max_length ~255)
- `category: Category` — a Python `str` `Enum` (`FOOD_DRINK`, `TRANSPORT`, `SHOPPING`,
  `BILLS`, `HEALTH`, `FUN`, `OTHER`), stored as a native column. Keep this as an enum,
  not a table — the set is small, fixed, and the frontend already hardcodes it.
- `note: str | None`
- `date: date` — the transaction date (defaults to today, but should be user-editable
  server-side even though the current UI doesn't expose it yet)
- `created_at: datetime`

### `Budget`

One row per user per category — a recurring monthly limit, not tied to a specific
month/year. Simplest model that supports the preview panel's "spent / budget" bar.

- `id: uuid.UUID` (PK)
- `owner_id: uuid.UUID` (FK → `user.id`, cascade delete)
- `category: Category`
- `monthly_limit: Decimal`
- unique constraint on `(owner_id, category)`

## Endpoints

Mirror `items.py`: `SessionDep` + `CurrentUser`, ownership checks on every read/write,
`{data, count}` list envelopes via a `*Public` / `*sPublic` schema pair.

### `/api/v1/accounts`

- `GET /` — list current user's accounts
- `POST /` — create
- `PATCH /{id}` — rename
- `DELETE /{id}` — delete (decide: cascade-delete its expenses, or block delete while
  expenses reference it — probably cascade, matching the `Item` pattern)

### `/api/v1/expenses`

- `GET /` — list, paginated (`skip`/`limit` like `Item`), with query filters:
  `category`, `account_id`, `date_from`, `date_to`, `merchant` (partial match, for
  search)
- `GET /{id}`
- `POST /` — body: `ExpenseCreate` (amount, merchant, category, account_id, note?,
  date)
- `PATCH /{id}` — body: `ExpenseUpdate` (all fields optional, same as `ItemUpdate`)
- `DELETE /{id}`
- `GET /similar?merchant=<text>&limit=3` — powers the "Similar recent" panel; case-
  insensitive partial match on `merchant`, ordered by `date desc`, scoped to
  `owner_id`
- `GET /summary?month=YYYY-MM` — powers dashboard aggregates: total spent, spent per
  category. Returns `{ category, total }[]` grouped by category for the given month
  (default current month). This is also what feeds the budget bar once joined with
  `Budget` client-side, or you can fold budgets into this response server-side (see
  below).

### `/api/v1/budgets`

- `GET /` — list all budgets for the user, each with a computed `spent` field for the
  current month (join/aggregate against `Expense` filtered by `owner_id`, `category`,
  and current month) — this is what `ExpensePreview`'s budget bar needs directly,
  instead of the frontend combining two calls
- `PUT /{category}` — upsert the limit for a category (simpler than separate
  create/update since it's a 1:1 per category)
- `DELETE /{category}`

## Payload shapes (Pydantic/SQLModel, matching `Item*` naming)

```python
class ExpenseCreate(SQLModel):
    amount: Decimal
    merchant: str
    category: Category
    account_id: uuid.UUID
    note: str | None = None
    date: date

class ExpenseUpdate(SQLModel):
    amount: Decimal | None = None
    merchant: str | None = None
    category: Category | None = None
    account_id: uuid.UUID | None = None
    note: str | None = None
    date: date | None = None

class ExpensePublic(SQLModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    account_id: uuid.UUID
    amount: Decimal
    merchant: str
    category: Category
    note: str | None
    date: date
    created_at: datetime

class ExpensesPublic(SQLModel):
    data: list[ExpensePublic]
    count: int
```

`AccountCreate` / `AccountPublic` / `AccountsPublic` and `BudgetCreate` /
`BudgetPublic` follow the same shape as `Expense*`.

## Deliberately out of scope for v1

- The "⌘ Parse" natural-language quick-entry bar in `AddExpense.tsx` is just a UI mock
  right now (no `onClick` wired up). It would need an LLM call to turn
  `"uber to airport 32.50 transport"` into `{merchant, amount, category}` — worth
  building later as `POST /api/v1/expenses/parse`, but don't block the core CRUD plan
  on it.

## Open decisions for you to make while implementing

1. **Account delete behavior** — cascade-delete an account's expenses, or forbid
   deletion while expenses reference it? The `Item` pattern cascades; expenses are
   more precious data, so you may want to reconsider.
2. **`Budget` upsert vs. separate POST** — `PUT /{category}` (upsert) is simpler given
   the unique-per-category constraint, but breaks from the `Item`-style separate
   create/update. Fine to diverge here, just noting it's a deliberate choice.
3. **Where `summary`/budget aggregation math lives** — server-side (recommended, keeps
   the frontend dumb) vs. fetching raw expenses and aggregating client-side. Given
   you're learning backend, doing the aggregation in SQL (`func.sum`, `group_by`) is
   good practice.

## After building

Once the routes exist, regenerate the frontend client and wire `useAddExpense.ts`'s
`handleSubmit` to the real `ExpensesService`:

```bash
bash ./scripts/generate-client.sh
```
