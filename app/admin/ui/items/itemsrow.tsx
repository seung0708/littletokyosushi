import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ActionsMenu from "../actionsmenu";
import {Product} from '../../../../types/products'

interface ProductRowProps {
  item: Product
}

const ProductRow: React.FC = ({item}) => {

    return (
      <TableRow>
        <TableCell>
          <Badge>Draft</Badge>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <img
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.categories.name}/${item.image_url[0]}`}
            
          />
        </TableCell>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell className="font-medium">{item.description}</TableCell>
        <TableCell className="hidden md:table-cell">{item.price.toFixed(2)}</TableCell>
        <TableCell className="hidden md:table-cell">{item.inventories.map(inventory => inventory.quantity_in_stock)}</TableCell>

        <TableCell>
          <ActionsMenu id={item.id} />
        </TableCell>
      </TableRow>
    );
};

export default ProductRow;
