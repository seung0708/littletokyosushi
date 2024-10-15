export interface ModifierGroup {
    id: number;
    name: string; 
    min: number;
    max: number;
    modifiers: Modifier[];
}

export interface Modifier {
    id: number;
    name: string;
    price: number;
    
}
