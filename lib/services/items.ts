export async function fetchFilteredItems(query: string, currentPage: number) {
    try {
        const response = await fetch(`http://admin.localhost:3000/api/items?query=${encodeURIComponent(query)}&page=${currentPage}`);
        
        if(!response.ok) {
            throw new Error('Failed to fetch menu items');
        }
        
        const data = await response.json();
        console.log(data)
        return data.items;

    } catch (error) {
        console.error(error)
        return [];
    }
} 

export async function fetchMenuItemsPages(query: string)  {
    try {
        const response = await fetch(`http://admin.localhost:3000/api/items?query=${encodeURIComponent(query)}`);
        
        if(!response.ok) {
            throw new Error('Failed to fetch menu items');
        }
        
        const data = await response.json();
        return data.totalPages || 1;

    } catch (error) {    
        console.error(error)
        return 1;
    }
}