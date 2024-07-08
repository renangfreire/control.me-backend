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
    userId: string,
    value: number,
    transaction_at: string,
    transactionType: transactionType
    monthTransaction: Months
    categoryId: string,
    formPaymentId: string
}