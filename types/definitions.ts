export interface Category {
    category_id: number;
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
    is_available: boolean;
    images: string[]; 
    category: Category;
    inventory: Inventory;
}