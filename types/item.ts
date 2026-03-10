export interface MenuItem {
    id?: number
    name: string
    description?: string
    category_name?: string
    base_price?: number
    is_available?: boolean
    image_urls?: string[]
    order_index?: number
    sub_group: string
    created_at?: string
    updated_at?: string
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
    modifier_option_id: number
    name: string
    price: number
    created_at?: string
}

export interface Category {
    id?: number
    name: string
}

function findMostFrequent(string) {
    const freq = new Map()
    for (let letter of string) {
        freq.set(letter, (freq.get(letter) || 0) + 1)
    }
    let mostFrequent;
    let max = 0
    for (let key in freq) {
        if (freq[key] > max) {
            max = freq[key] 
            mostFrequent = key
        }
    }
    return mostFrequent;
}