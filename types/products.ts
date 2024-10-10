import categories, {Category} from './categories';


export interface Product {
    id: number, 
    title: string, 
    description: string, 
    price: number,
    quantity: number,
    images: string[], 
    category: Category
}

export const products: Product[] = [
    {
        id: 1, 
        title: 'Salmon Combo',
        description: '8 pieces of Salmon Sushi & 4 pieces of Salmon Roll',
        price: 18.00, 
        quantity: 8,
        images: ['/../assets/images/SalmonCombo.png'],
        category: categories[1]
    }, 
    {
        id: 2, 
        title: 'Toro Combo',
        description: '8 pieces of Toro Sushi and 4 pieces of Tuna roll',
        price: 20.50, 
        quantity: 2,
        images: ['/../assets/images/'],
        category: categories[1]
    },
    {
        id: 3, 
        title: 'Deluxe Matsu',
        description: '9 pieces of assorted sushi and 4 pieces of tuna roll',
        price: 20.50, 
        quantity: 4,
        images: ['/../assets/images/DeluxeMatsu.png'],
        category: categories[1]
    },
    {
        id: 4, 
        title: 'Toro Salmon Combo',
        description: '4 pieces of Toro Sushi, 4 pieces of Salmon Sushi and 4 pieces of Tuna Roll',
        price: 20.50, 
        quantity: 2,
        images: ['/../assets/images/ToroSalmonCombo.png'],
        category: categories[1]
    },

]