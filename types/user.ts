export interface User {
    id?: string 
    email: string
    password?: string
    user_metadata?: {
        email?: string
        first_name?: string
        last_name?: string
        phone?: string
    }
    is_anonymous?: boolean
}