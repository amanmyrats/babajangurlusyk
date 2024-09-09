import { Client } from "./client.model";
import { Supplier } from "./supplier.model";

export class Payment {
    id?: string;
    no?: string;
    partner_type?: string;
    client?: string;
    client_obj?: Client;
    supplier?: string;
    supplier_obj?: Supplier;
    payment_type?: string;
    amount?: string;
    note?: string;
    date?: string;
    created_at?: string;
    updated_at?: string;
}
