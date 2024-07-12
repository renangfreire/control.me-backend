type Months =
    "JANUARY" |
    "FEBRUARY" |
    "MARCH" | 
    "APRIL" | 
    "MAY" |
    "JUNE" |
    "JULY" |
    "AUGUST" |
    "SEPTEMBER" |
    "OCTOBER" |
    "NOVEMBER" |
    "DECEMBER"

type transactionType = "EXPENSE" | "REVENUE"

export interface createTransactionRequestSchema {
    user_id: string,
    value: number,
    transaction_at: string,
    transaction_type: transactionType
    monthTransaction: Months
    category_id?: string | null,
    formPayment_id?: string | null
}
