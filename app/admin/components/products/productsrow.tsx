import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ActionsMenu from "../actionsmenu";
import {Product} from '../../../../types/products'

interface ProductRowProps {
  product: Product
}

const ProductRow: React.FC<ProductRowProps> = ({product}) => {
    return (
      <TableRow>
        <TableCell className="hidden sm:table-cell">
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            src={product.images[0]}
            height="64"
            width="64"
          />
        </TableCell>
        <TableCell className="font-medium">{product.title}</TableCell>
        <TableCell>
          <Badge>Draft</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">{product.price}</TableCell>
        <TableCell className="hidden md:table-cell">{product.quantity}</TableCell>
        <TableCell className="hidden md:table-cell"></TableCell>
        <TableCell>
          <ActionsMenu id={product.id} />
        </TableCell>
      </TableRow>
    );
};

export default ProductRow