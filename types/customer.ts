export interface Customer {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    guestEmail?: string;
    guestName?: string;
    signinEmail?: string;
    signinPassword?: string;
    phone?: string;
    birth_date?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    marketing_preference?: {
        sms?: boolean;
        email?: boolean;
    }
    created_at?: string;
    updated_at?: string;
}

export interface CustomerAddress {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
}