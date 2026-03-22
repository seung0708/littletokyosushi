export interface MenuItem {
    id?: string
    name: string
    description?: string
    base_price?: number
    image_urls?: string[]
    is_available?: boolean
    order_index?: number
    created_at?: string
    updated_at?: string
    category_name?: string
    sub_group?: string
    modifier_groups?: ModifierGroup[]
}

export interface ModifierGroup {
    id: string
    menu_item_id: string
    name: string
    min_sel?: number
    max_sel?: number
    is_required: boolean
    created_at?: string
    updated_at?: string
    modifier_options?: ModifierOption[]
}

export interface ModifierOption {
    id: string
    modifier_group_id: string
    name: string
    price: number
    created_at?: string
}

export interface Category {
    id?: string
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