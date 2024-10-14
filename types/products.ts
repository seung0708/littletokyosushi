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
        images: ['/assets/images/SalmonCombo.png'],
        category: categories[1]
    }, 
    {
        id: 2, 
        title: 'Toro Combo',
        description: '8 pieces of Toro Sushi and 4 pieces of Tuna roll',
        price: 20.50, 
        quantity: 2,
        images: ['/assets/images/ToroCombo.png'],
        category: categories[1]
    },
    {
        id: 3, 
        title: 'Deluxe Matsu',
        description: '9 pieces of assorted sushi and 4 pieces of tuna roll',
        price: 20.50, 
        quantity: 4,
        images: ['/assets/images/DeluxeMatsu.png'],
        category: categories[1]
    },
    {
        id: 4, 
        title: 'Toro Salmon Combo',
        description: '4 pieces of Toro Sushi, 4 pieces of Salmon Sushi and 4 pieces of Tuna Roll',
        price: 20.50, 
        quantity: 2,
        images: ['/assets/images/ToroSalmonCombo.png'],
        category: categories[1]
    },
    {
        id: 5, 
        title: 'Salmon Avocado Shrimp Tempura Medley',
        description: "Your choice of either a Salmon Avocado Crunch Roll or Shrimp Tempura Crunch Roll with 6 pieces of Avocado Roll and 6 pieces of Salmon Roll Includes Ginger, Wasabi, and Soy Sauce",
        price: 20.00, 
        quantity: 2,
        images: ['/assets/images/Salmon Avocado Shrimp Tempura Avocado Medley.png'],
        category: categories[1]
    },
    {
        id: 6, 
        title: 'Little Tokyo Sushi',
        description: '7 pieces of Assorted Sushi, 4 pieces of Salmon/Tuna roll, and 4 pieces of Cucumber Roll',
        price: 15.50, 
        quantity: 12,
        images: ['/assets/images/Little Tokyo Sushi (2).png'],
        category: categories[1]
    },
    {
        id: 7, 
        title: 'Sushi Cham',
        description: '2 pieces of Salmon Sushi, 2 pieces of Tuna Sushi, 4 pieces of Salmon Roll or 4 pieces of Tuna Roll, and 4 pieces of California Roll or Salmon Avocado Roll',
        price: 17.50, 
        quantity: 10,
        images: ['/assets/images/Sushi Cham.png'],
        category: categories[1]
    },
    {
        id: 8, 
        title: 'New Yoker Sushi',
        description: '2 pieces of Salmon Sushi, 2 pieces of Tuna Sushi, 2 pieces of Your Choice, and 3 pieces of California Roll',
        price: 16.50, 
        quantity: 2,
        images: ['/assets/images/Yorker Sushi.png'],
        category: categories[1]
    },
    {
        id: 9, 
        title: 'Shokado-B',
        description: "3 Tuna & 3 Salmon Rolls, Inari Sushi, Shibazuke(Pickled Eggplant), 3 kinds of Sushi (1 Salmon, 1 Tuna, and 1 Customer's choice), and Eel with a drizzle of Eel sauce over rice",
        price: 16.00, 
        quantity: 8,
        images: ['/assets/images/Shokado-B.png'],
        category: categories[1]
    },
    {
        id: 10, 
        title: 'Tuna Sushi',
        description: "6 pieces of Tuna Sushi",
        price: 14.00, 
        quantity: 1,
        images: ['/assets/images/Tuna Sushi.png'],
        category: categories[2]
    },
    {
        id: 11, 
        title: 'Saba (Makerel) Sushi',
        description: "6 pieces of Makerel Sushi",
        price: 12.00, 
        quantity: 1,
        images: ['/assets/images/Makerel Sushi.png'],
        category: categories[2]
    },

    {
        id: 12, 
        title: 'Tuna Salmon Sushi',
        description: "3 pieces of Tuna Sushi and 3 pieces of Salmon Sushi",
        price: 14.50, 
        quantity: 2,
        images: ['/assets/images/Tuna Salmon Sushi.png'],
        category: categories[2]
    },
    {
        id: 13, 
        title: 'Inari Sushi',
        description: "6 pieces of Inari(Tofu) Sushi",
        price: 11.00, 
        quantity: 2,
        images: ['/assets/images/Inari.png'],
        category: categories[2]
    },
    {
        id: 14, 
        title: 'Unagi Sushi',
        description: "6 Pieces of Unagi(Eel) Sushi",
        price: 13.00, 
        quantity: 1,
        images: ['/assets/images/Unagi Sushi.png'],
        category: categories[2]
    },
    {
        id: 15, 
        title: 'Tuna Unagi Sushi',
        description: "3 pieces of Tuna Sushi & 3 pieces of Unagi(Eel) Sushi",
        price: 14.00, 
        quantity: 1,
        images: ['/assets/images/Tuna Unagi Sushi.png'],
        category: categories[2]
    },
    {
        id: 16, 
        title: 'Salmon Unagi Sushi',
        description: "3 pieces of Salmon Sushi & 3 pieces of Unagi(Eel) Sushi",
        price: 16.00, 
        quantity: 1,
        images: ['/assets/images/Salmon Unagi.png'],
        category: categories[2]
    },
    {
        id: 17, 
        title: 'Salmon Sushi',
        description: "6 pieces of Salmon Sushi",
        price: 15.00, 
        quantity: 2,
        images: ['/assets/images/Salmon Sushi.png'],
        category: categories[1]
    },
    {
        id: 18, 
        title: 'Chirashi',
        description: "Rice bowl topped with Tuna, Tilapia, Unagi, Shrimp, Tamago, Salmon Roe, Yuzu Masago, Masago, Seaweed Salad, and Radish Sprouts",
        price: 16.00, 
        quantity: 2,
        images: ['/assets/images/Chirashi.png'],
        category: categories[3]
    },
    {
        id: 19, 
        title: 'Salmon Bowl',
        description: "Rice bowl with Salmon on top, Tilapia, Radish Sprouts, and Green Onions",
        price: 15.00, 
        quantity: 2,
        images: ['/assets/images/Salmon Bowl.png'],
        category: categories[3]
    },
    {
        id: 20, 
        title: 'Salmon Spicy Tuna Bowl',
        description: "Rice bowl with Spicy Tuna on top, Tilapia, Radish Sprouts, and Green Onions",
        price: 15.00, 
        quantity: 2,
        images: ['/assets/images/Salmon Spicy Tuna Bowl.png'],
        category: categories[3]
    },
    {
        id: 21, 
        title: 'Spicy Tuna Bowl',
        description: "3 Tuna & 3 Salmon Rolls, Inari Sushi, Shibazuke(Pickled Eggplant), 3 kinds of Sushi (1 Salmon, 1 Tuna, and 1 Customer's choice), and Eel with a drizzle of Eel sauce over rice",
        price: 15.00, 
        quantity: 2,
        images: ['/assets/images/Spicy Tuna Bowl.png'],
        category: categories[3]
    },
    {
        id: 22, 
        title: 'Unagi Bowl',
        description: "Rice bowl with Unagi, a Drizzle of Eel Sauce, and Tamago",
        price: 11.50, 
        quantity: 2,
        images: ['/assets/images/Unagi Bowl.png'],
        category: categories[3]
    },
    {
        id: 23, 
        title: 'Alaskan Roll',
        description: "8 pieces of California Roll with Salmon on top",
        price: 16.50, 
        quantity: 2,
        images: ['/assets/images/Alaskan Roll(1).png'],
        category: categories[4]
    },
    {
        id: 24, 
        title: 'Dragon Roll',
        description: "8 Piece Spicy Tuna Roll with Salmon, Tuna, and Avocado on top",
        price: 16.50, 
        quantity: 2,
        images: ['/assets/images/Dragon Roll.png'],
        category: categories[4]
    },
    {
        id: 25, 
        title: 'Rainbow Roll',
        description: "8 piece California Roll with Salmon, Yellowtail, Shrimp, Tilapia, Tuna, and Avocado on top",
        price: 11.50, 
        quantity: 2,
        images: ['/assets/images/Rainbow Roll.png'],
        category: categories[4]
    },
    {
        id: 26, 
        title: 'Carolina Roll',
        description: "8 Piece Spicy Tuna Roll with Spicy Tuna on top and a drop of Spicy Mayo",
        price: 16.50, 
        quantity: 2,
        images: ['/assets/images/Carolina Roll.png'],
        category: categories[4]
    },
    {
        id: 27, 
        title: 'Crunchy Roll',
        description: "8 Piece of either California Roll, Spicy Tuna Roll, or Spicy Octopus Roll with Friend Onions, Spicy Mayo, and Eel Sauce on Top",
        price: 16.00, 
        quantity: 4,
        images: ['/assets/images/Crunchy ROLL.png'],
        category: categories[4]
    },
    {
        id: 27, 
        title: 'Futomaki Burrito',
        description: "A Fusion Roll with either Salmon and Tamago or Spicy Tuna, Cucumber, and Avocado",
        price: 12.00, 
        quantity: 2,
        images: ['/assets/images/Futomaki Burrito.png'],
        category: categories[4]
    },
    {
        id: 28, 
        title: 'Futomaki Roll',
        description: "8 piece Futoma Maki Roll with Kanpyo(Gourd Strips), Denbu(Sakura Fish Flakes), Tamago(Egg), Imitation Crab, and Cucumber",
        price: 12.50, 
        quantity: 2,
        images: ['/assets/images/Futomaki.png'],
        category: categories[4]
    },
    {
        id: 29, 
        title: 'Futomaki Roll & Inari',
        description: "4 pieces of Futomaki Roll and 4 Pieces of Inari Sushi",
        price: 13.00, 
        quantity: 2,
        images: ['/assets/images/Futomaki and Inari.png'],
        category: categories[4]
    },
    {
        id: 30, 
        title: 'Unagi Futomaki Roll',
        description: "8 Piece Futomaki Roll with Unagi and Cucumber",
        price: 13.50, 
        quantity: 2,
        images: ['/assets/images/Unagi Maki.png'],
        category: categories[4]
    },
    {
        id: 31, 
        title: 'Unagi Futomaki Roll & Inari Sushi',
        description: "4 pieces of Unagi Futomaki Roll and 4 pieces of Inari Sushi",
        price: 13.50, 
        quantity: 2,
        images: ['/assets/images/Unagi Maki and Inari.png'],
        category: categories[4]
    },
    {
        id: 32, 
        title: 'California Roll',
        description: "8 piece roll of Imitation Crab, Mayo, Avocado, and Cucumber",
        price: 10.50, 
        quantity: 12,
        images: ['/assets/images/California Roll.png'],
        category: categories[4]
    },
    {
        id: 33, 
        title: 'Popcorn Cali Roll',
        description: "8 piece California Roll with Popcorn Shrimp on top and a drizzle of Spicy May and Eel Sauce",
        price: 13.00, 
        quantity: 2,
        images: ['/assets/images/Popcorn Cali Roll.png'],
        category: categories[4]
    },
    {
        id: 33, 
        title: 'Spicy Tuna Roll',
        description: "8 piece roll of Spicy Tuna and Cucumber",
        price: 13.00, 
        quantity: 6,
        images: ['/assets/images/Spicy Tuna.png'],
        category: categories[4]
    },
    {
        id: 34, 
        title: 'Spicy Shrimp Tempura Roll',
        description: "8 piece Roll of Shrimp Tempura, Avocado, Cucumber, and a drop of Spicy Mayo",
        price: 13.00, 
        quantity: 2,
        images: ['/assets/images/Spicy Shrimp Tempura Roll.png'],
        category: categories[4]
    },
    {
        id: 34, 
        title: 'Spider Roll',
        description: "8 piece Roll of Soft-Shell Crab, Yamagobo (Pickled Burdock), Kaiware(Radish Sprouts), and Cucumber",
        price: 13.00, 
        quantity: 2,
        images: ['/assets/images/Spider Roll.png'],
        category: categories[4]
    },
    {
        id: 35, 
        title: 'Vegetable Roll',
        description: "8 piece roll of Avocado, Kanpyo (Gourd Strips), Cucumber, Shibazuke (Pickled Eggplant), and Yamagobo (Pickled Burdock Root)",
        price: 13.00, 
        quantity: 1,
        images: ['/assets/images/Vegetable Roll.png'],
        category: categories[4]
    },
    {
        id: 36, 
        title: 'Eel Avocado Roll',
        description: "8 piece roll with Eel and Avocado",
        price: 13.00, 
        quantity: 2,
        images: ['/assets/images/Eel Avocado Roll.png'],
        category: categories[4]
    },
    {
        id: 37, 
        title: 'Philadelphia Roll',
        description: "8 piece roll of Salmon, Cream Cheese, Avocado, and Cucumber",
        price: 10.50, 
        quantity: 1,
        images: ['/assets/images/Philadelphia Roll.png'],
        category: categories[4]
    },
    {
        id: 38, 
        title: 'Spicy Salmon Roll',
        description: "8 piece roll of Salmon, Avocado, Cucumber, and a drop of Spicy Mayo",
        price: 13.00, 
        quantity: 2,
        images: ['/assets/images/Spicy Salmon Roll.png'],
        category: categories[4]
    },
    {
        id: 39, 
        title: 'Spicy Grilled Salmon Roll',
        description: "8 piece roll of Grilled Salmon, Avocado, Cucumber, and drops of Spicy Mayo and Eel Sauce",
        price: 13.00, 
        quantity: 1,
        images: ['/assets/images/Spicy Grilled Salmon Roll.png'],
        category: categories[4]
    },
    {
        id: 40, 
        title: 'Tuna Cucumber Roll',
        description: "8 piece Roll of Tuna & 8 piece Roll of Cucumber",
        price: 10.00, 
        quantity: 2,
        images: ['/assets/images/Tuna Cucumber Roll.png'],
        category: categories[4]
    },
    {
        id: 41, 
        title: 'Cucumber Roll',
        description: "16 piece Roll of Cucumber",
        price: 8.00, 
        quantity: 2,
        images: ['/assets/images/Cucumber Roll.png'],
        category: categories[4]
    },
    {
        id: 41, 
        title: 'Tuna Salmon Roll',
        description: "8 piece Roll of Tuna & 8 piece Roll of Salmon",
        price: 11.00, 
        quantity: 2,
        images: ['/assets/images/Tuna Salmon Roll.png'],
        category: categories[4]
    },
    {
        id: 42, 
        title: 'Tuna Roll',
        description: "16 piece Roll of Tuna",
        price: 11.00, 
        quantity: 2,
        images: ['/assets/images/Tuna Roll.png'],
        category: categories[4]
    },
    {
        id: 43, 
        title: 'Salmon Cucumber Roll',
        description: "8 piece Roll of Salmon & 8 piece Roll of Cucumber",
        price: 10.00, 
        quantity: 2,
        images: ['/assets/images/Salmon Cucumber.png'],
        category: categories[4]
    },
    {
        id: 44, 
        title: 'Salmon Roll',
        description: "16 piece Roll of Salmon",
        price: 11.00, 
        quantity: 2,
        images: ['/assets/images/Salmon Roll.png'],
        category: categories[4]
    },
    {
        id: 45, 
        title: 'Tuna Lover Party Tray - New',
        description: "22 piece Tuna Sushi, 32 piece Cucumber Roll, and 16 piece Tuna Roll",
        price: 60.00, 
        quantity: 2,
        images: ["/assets/images/Tuna Lovin' Party Tray.png"],
        category: categories[5]
    },
    {
        id: 46, 
        title: 'Margarita Special Roll Party Tray',
        description: "24 pieces of California Roll, 24 pieces of Avocado Roll, and 8 pieces of Salmon Avocado Roll",
        price: 55.00, 
        quantity: 2,
        images: ['/assets/images/Magarita Roll Party Tray.png'],
        category: categories[5]
    },
    {
        id: 47, 
        title: 'Orlando Sushi Party Tray',
        description: "11 pieces of Tuna Sushi, 11 pieces of Salmon Sushi, 4 pieces of Tilapia, 4 pieces of Shrimp, 2 pieces of Unagi, and 2 pieces of Tako",
        price: 68.00, 
        quantity: 2,
        images: ['/assets/images/Orlando Sushi Party Tray.png'],
        category: categories[5]
    },
    {
        id: 48, 
        title: 'California Party Tray Large - 48 pieces',
        description: "48 pieces of California Roll",
        price: 52.00, 
        quantity: 2,
        images: ['/assets/images/California Party Tray Large(1).png'],
        category: categories[5]
    },
    {
        id: 50, 
        title: 'Family Sushi Party Tray - 40 pieces',
        description: "8 piece Tuna, 4 piece Yellowtail, 4 piece Halibut, 8 piece Salmon, 4 piece Scallops, 4 piece Raw Shrimp/Ebi Sushi, 4 piece Unagi Sushi, and 4 piece Ikura",
        price: 80.00, 
        quantity: 2,
        images: ['/assets/images/Family Sushi Party.png'],
        category: categories[5]
    },
    {
        id: 51, 
        title: 'Uramaki Party Tray Large - 48 pieces',
        description: "24 pieces of Spicy Tuna Roll & 24 pieces of California",
        price: 58.00, 
        quantity: 2,
        images: ['/assets/images/Uramaki Party Large.png'],
        category: categories[5]
    },
    {
        id: 53, 
        title: 'Sakura Sushi Party Tray',
        description: "5 piece Tuna Sushi, 3 piece Tako Sushi, 3 piece Scallop Sushi, 3 piece Ebi/Shrimp Sushi, 3 piece Ika Sushi, 3 piece Tamago Sushi, 3 piece Salmon Sushi, 3 piece Unagi Sushi, 3 piece Yellowtail Sushi, 3 piece Halibut Sushi, 4 piece Ikura Sushi, 8 piece Cucumber Roll, and 8 piece Tuna Roll",
        price: 76.00, 
        quantity: 2,
        images: ['/assets/images/Sakura Sushi Party Tray.png'],
        category: categories[5]
    },
    {
        id: 53, 
        title: 'Ume Sushi Party Tray - 22 pieces',
        description: "3-piece Tuna Sushi, 3-piece Tilapia Sushi, 2-piece Ika/Squid Sushi, 3-piece Ebi/Shrimp, 2-piece Tako/Octopus, 3-piece Salmon Sushi, 3-piece Unagi/Eel Sushi, 3-piece Ikura/Salmon Roe Sushi",
        price: 45.00, 
        quantity: 2,
        images: ['/assets/images/Ume Sushi.png'],
        category: categories[5]
    },
    {
        id: 55, 
        title: 'Hanamori Sushi Party Tray',
        description: "6-piece Tuna Sushi, 3-piece Yellowtail Sushi, 3-piece Albacore Sushi, 3-piece Halibut Sushi, 6-piece Salmon Sushi, 3-piece Shrimp Sushi, 3-piece Unagi Sushi, 3-piece Tako Sushi, and 3-piece Ikura Sushi",
        price: 70.00, 
        quantity: 2,
        images: ['/assets/images/Hanamori Sushi Party Tray.png'],
        category: categories[5]
    },
    
]