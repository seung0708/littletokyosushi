import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
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
  
const FilterDropdown: React.FC = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Filter
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
  