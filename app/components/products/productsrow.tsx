import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ActionsMenu from "../actionsmenu";


const ProductRow: React.FC = () => {
    return (
      <TableRow>
        <TableCell className="hidden sm:table-cell">
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            src="/placeholder-user.jpg"
            height="64"
            width="64"
          />
        </TableCell>
        <TableCell className="font-medium"></TableCell>
        <TableCell>
          <Badge></Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell"></TableCell>
        <TableCell className="hidden md:table-cell"></TableCell>
        <TableCell className="hidden md:table-cell"></TableCell>
        <TableCell>
          <ActionsMenu />
        </TableCell>
      </TableRow>
    );
};

export default ProductRow