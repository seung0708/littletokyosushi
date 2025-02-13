import { TableRow, TableCell } from "@/components/ui/table";
import ActionsMenu from "@/components/admin/actionsmenu";
import {MenuItem} from '@/types/item';
import Image from "next/image";

type ItemRowProps = {
  item: MenuItem; 

}

const ItemRow: React.FC<ItemRowProps> = ({item}) => {
  return (
    <TableRow>
        <TableCell className="hidden sm:table-cell w-48 h-48">
          <div className="w-full h-full">
            <Image
              alt="item image"
              className="aspect-square rounded-md object-cover w-full h-full"
              height={500}
              width={500}
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item?.image_urls?.[0]}`}
            />
          </div>
        </TableCell>
        <TableCell className="font-medium">{item?.name}</TableCell>
        <TableCell className="font-medium max-w-[200px] truncate">{item?.description}</TableCell>
        <TableCell className="hidden md:table-cell">{item?.price?.toFixed(2)}</TableCell>
        {/* <TableCell className="hidden md:table-cell">{item?.quantity_in_stock}</TableCell> */}
        <TableCell>
          <ActionsMenu id={item.id} />
        </TableCell>
    </TableRow>
  )
};

export default ItemRow;
