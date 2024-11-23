export interface Category {
    id: number;
    name: string;
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
    image_url: string[]; 
    category: Category;
    inventory: Inventory[];
}