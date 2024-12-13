import ItemRow from './itemsrow';

import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table'
import { Item } from '@/types/definitions';

interface ItemsTableProps {
  items: Item[];
}

export default function ItemsTable({ items }: ItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
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
        {items?.map((item: Item) => <ItemRow key={item.id} item={item} />)}
      </TableBody>
    </Table>
  );
}
