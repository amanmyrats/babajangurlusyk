import { Role } from "./role.model";

export class User {
    id?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_active?: string;
    is_staff?: string;
    date_joined?: Date;
    role?: string;
    role_name?: string
}