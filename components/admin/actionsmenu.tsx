'use client'
import React from 'react';
import Link from 'next/link';
import {MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {MenuItem} from '@/types/item';

interface ActionMenuProps {
  id: MenuItem['id']
}

const ActionsMenu: React.FC<ActionMenuProps> = ({id}) => {

  const onDelete = async (id: MenuItem['id']) => {
    const result = await fetch(`/api/items?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" /> 
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/items/${id}/edit`}>Edit</Link>
            </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant="ghost" onClick={() => onDelete(id)}>
              Delete
            </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  export default ActionsMenu