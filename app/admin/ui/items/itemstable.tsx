'use client';
import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import ProductRow from './itemsrow';
import { Pagination, PaginationContent, PaginationPrevious } from '@/components/ui/pagination';

const ItemsTable: React.FC = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
      const fetchMenuItems = async () => {
        const {data, error} = await supabase.from('menu_items').select('*, inventories(*), categories(*)');
        if (error) {
          console.error(error)
        } else {
          setItems(data) 
        }
     
      }

      fetchMenuItems();
    }, []);

    return (
      <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span>Image</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Quantity</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {items.map(item => <ProductRow key={item.id} item={item} />)}
        </TableBody>
      </Table>
      </>
    );
  };
  
export default ItemsTable;