import { Currency } from "./currency.model";
import { ExpenseType } from "./expense-type";

export class Expense {
    id?: string;
    expense_type?: string;
    expense_type_obj?: ExpenseType;
    description?: string;
    amount?: number;
    currency?: string;
    currency_obj?: Currency;
}
