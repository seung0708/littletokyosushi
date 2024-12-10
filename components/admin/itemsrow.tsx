import { TableRow, TableCell } from "@/components/ui/table";
import ActionsMenu from "./actionsmenu";
import {Product} from '@/types/definitions';

type ProductRowProps = {
  item: Product; 

}

const ProductRow: React.FC<ProductRowProps> = ({item}) => {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls?.[0]}`}
        />
      </TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="font-medium ">{item.description}</TableCell>
      <TableCell className="hidden md:table-cell">{item.price.toFixed(2)}</TableCell>
      <TableCell className="hidden md:table-cell">{item?.quantity_in_stock}</TableCell>
      <TableCell>
        <ActionsMenu id={item.id} />
      </TableCell>
    </TableRow>
  )
};

export default ProductRow;
