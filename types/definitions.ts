import { FieldError, UseFormRegister } from "react-hook-form";

export default interface User {
    id?: number;
    auth_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }

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
    image_urls: string[]; 
    category_name: string
    quantity_in_stock: number ;
    low_stock_threshold: number;
    sync_status: boolean
}

export type ItemFormData = {
    item_name: string;
    description: string;
    image: string; 
    price: number; 
    category: string;
}

export type ItemFormFieldProps = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<ItemFormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
}

export type ValidFieldNames =
| "item_name"
| "description"
| "image"
| "price"
| "category";

