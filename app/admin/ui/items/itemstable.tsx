
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import ProductRow from './itemsrow';
import { fetchFilteredItems } from '../../lib/supabase/items-data';

export default async function ItemsTable({
  query, 
  currentPage
}: {
  query: string, 
  currentPage: number
}) {
  const items = await fetchFilteredItems(query, currentPage)
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
           {items?.map(item => <ProductRow key={item.id} item={item} />)}
        </TableBody>
      </Table>
      </>
    );
  };
  
