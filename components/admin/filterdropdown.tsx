'use state'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface DropDownItem {
  value: string;
  label: string;
}

interface FilterDropdownProps {
    trigger: React.ReactNode;
    label?: string;
    items: DropDownItem[];
    onSelect?: (selectedItems: DropDownItem[]) => void;
    
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ trigger, label, items, onSelect}) => {
    const [selectedItems, setSelectedItems] = useState<DropDownItem[]>([]);

    const handleSelect = (value: string) => {
      setSelectedItems((prevSelected) => {
          const isSelected = prevSelected.find(item => item.value === value);
          const newSelected = isSelected 
              ? prevSelected.filter(item => item.value !== value) // Deselect if already selected
              : [...prevSelected, items.find(item => item.value === value)!]; // Select if not selected

          onSelect && onSelect(newSelected); // Call the callback with the new selection
          return newSelected;
      });
    };

    return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
          {trigger}
         </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {items.map((item) => (
            <DropdownMenuCheckboxItem 
              key={item.value} 
              onSelect={() => handleSelect(item.value)} 
              checked={selectedItems.some(selected => selected.value === item.value)}>
                {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default FilterDropdown;

  