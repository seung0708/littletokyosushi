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
              src={`${item?.image_urls?.[0]}`}
            />
          </div>
        </TableCell>
        <TableCell className="font-medium">{item?.name}</TableCell>
        <TableCell className="font-medium max-w-[200px] truncate">{item?.description}</TableCell>
        <TableCell className="hidden md:table-cell">{item?.category_name}</TableCell>
        <TableCell className="hidden md:table-cell">${item?.base_price?.toFixed(2)}</TableCell>
        <TableCell>
          <ActionsMenu id={item.id} name={item.name} />
        </TableCell>
    </TableRow>
  )
};

export default ItemRow;
