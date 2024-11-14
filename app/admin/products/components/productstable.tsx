'use client';
import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import {products} from '../../../../types/products'
import ProductRow from './productsrow';

export const ProductsTable: React.FC = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
      const fetchMenuItems = async () => {
        const {data, error} = await supabase.from('menu_items').select('*, inventories(*)');
        if (error) {
          console.error(error)
        }
        console.log(data)
        setItems(data)
      }

      fetchMenuItems();
    }, []);

    return (
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
    );
  };
  
