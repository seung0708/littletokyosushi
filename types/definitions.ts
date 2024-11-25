export interface Category {
    category_name: string;
}

export default interface Inventory {
    quantity_in_stock: number ;
    low_stock_threshold: number;
    sync_status: boolean
}
export interface Product {
    id: number; 
    name: string; 
    description: string; 
    price: number;
    category_id: number;
    is_available: boolean;
    special_instructions: string;
    image_url: string[]; 
    category_name: string
    quantity_in_stock: number ;
    low_stock_threshold: number;
    sync_status: boolean
}