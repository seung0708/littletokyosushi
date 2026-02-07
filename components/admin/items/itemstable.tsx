import ItemRow from './itemsrow';

import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table'
import { MenuItem,  } from '@/types/item';

interface ItemsTableProps {
  menu_items: MenuItem[];
}

export default function ItemsTable({ menu_items }: ItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">
            <span>Image</span>
          </TableHead>
          <TableHead className="w-[150px]">Name</TableHead>
          <TableHead className="max-w-[200px]">Description</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead className="hidden md:table-cell w-[100px]">Price</TableHead>
          <TableHead className="w-[100px]"><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menu_items?.map((item: MenuItem) => <ItemRow key={item.id} item={item} />)}
      </TableBody>
    </Table>
  );
}
