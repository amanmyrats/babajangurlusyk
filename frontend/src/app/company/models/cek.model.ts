import { Client } from "./client.model";
import { Supplier } from "./supplier.model";

export class Cek {
    id?: string;
    no?: string;
    partner_type?: string;
    client?: string;
    client_obj?: Client;
    supplier?: string;
    supplier_obj?: Supplier;
    cek_type?: string;
    is_nesye?: string;
    amount?: string;
    alan_zatlary?: string;
    referenced_by?: string;
    referenced_by_obj?: Client;
    reference_percentage?: number;
    note?: string;
    date?: string;
    created_at?: string;
    updated_at?: string;
}
