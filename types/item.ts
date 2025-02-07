export interface MenuItem {
    id?: number
    name: string
    description: string
    categories: Category
    price: number
    is_available: boolean
    image_urls: string[]
    created_at: string
    updated_at: string
    modifiers?: Modifier[]
}

export interface Modifier {
    id: number
    menu_item_id: number
    name: string
    min_selections?: number
    max_selections?: number
    is_required?: boolean
    created_at?: string
    updated_at?: string
    modifier_options?: ModifierOption[]
}

export interface ModifierOption {
    id: number
    modifier_id: number
    name: string
    price: number
    created_at?: string
}

export interface Category {
    id?: number
    name: string
}