
import { Button } from "@/components/ui/button";
import { File, ListFilter, PlusCircle } from "lucide-react";

export const ActionButtons: React.FC = () => {
    return (
      <div className="ml-auto flex items-center gap-2">
        <FilterDropdown />
        <ExportButton />
        <AddProductButton />
      </div>
    );
  };
  

const ExportButton: React.FC = () => {
    return (
      <Button size="sm" variant="outline" className="h-8 gap-1">
        <File className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Export
        </span>
      </Button>
    );
};
 
const AddProductButton: React.FC = () => {
    return (
      <Button size="sm" className="h-8 gap-1">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Product
        </span>
      </Button>
    );
  };
  