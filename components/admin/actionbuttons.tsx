
import { Button } from "@/components/ui/button";
import { File, PlusCircle } from "lucide-react";

interface ExportButtonProps {
  children?: React.ReactNode
}
  
export const ExportButton: React.FC<ExportButtonProps> = ({children}) => {
    return (
      <Button size="sm" variant="outline" className="h-8 gap-1">
        <File className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {children}
        </span>
      </Button>
    );
};
 

interface AddButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({children }) => {
    return (
      <Button size="sm" className="h-8 gap-1">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        {children}
        </span>
      </Button>
    );
  };
  