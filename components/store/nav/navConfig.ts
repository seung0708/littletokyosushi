export const navigation = {
  pages: [
    { name: 'About', href: '/about' },
    { name: 'Menu',  href: '/menu'
     },
     {name: 'Contact Us', href: '/contact'}
    ]
    
}

export interface NavProps {
    open: boolean, 
    setOpen: (open: boolean) => void;
}
