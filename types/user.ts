export interface User {
    id?: string 
    email: string
    encrypted_password?: string
    raw_user_meta_data?: {
        email?: string
        first_name?: string
        last_name?: string
    }
}