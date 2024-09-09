import { Category } from "./category.model";
import { Currency } from "./currency.model";
import { Unit } from "./unit.model";

export class Product {
    id?: string;
    name?: string;
    name_2?: string;
    name_3?: string;
    unit?: string;
    unit_obj?: Unit;
    initial_price?: string;
    initial_price_currency?: string;
    initial_price_currency_obj?: Currency;
    sale_price?: string;
    sale_price_currency?: string;
    sale_price_currency_obj?: Currency;
    category?: string;
    category_obj?: Category;
    description?: string;
    created_at?: string;
    updated_at?: string;

}
