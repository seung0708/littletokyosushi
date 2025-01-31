export interface Item {
    id: number
    name: string
    description: string
    price: number
    image_urls: string[]
    category_id: number
    is_available: boolean
    special_instructions: string
    quantity_in_stock: number
    low_stock_threshold: number
    sync_status: boolean
    modifiers: Modifier[]
}