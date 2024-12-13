'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Item } from '@/types/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  is_available: z.boolean(),
  special_instructions: z.string().optional(),
  quantity_in_stock: z.string().min(1, 'Quantity is required'),
  low_stock_threshold: z.string().min(1, 'Low stock threshold is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function EditItemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        console.log('Fetching item with ID:', typeof params.id);
        const response = await fetch(`/api/items?id=${params.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched item data:', data);
        
        const fetchedItem = data.item;
        if (fetchedItem) {
          setItem(fetchedItem);
          // Set form values
          setValue('name', fetchedItem.name);
          setValue('description', fetchedItem.description);
          setValue('price', fetchedItem.price.toString());
          setValue('is_available', fetchedItem.is_available);
          setValue('special_instructions', fetchedItem.special_instructions || '');
          setValue('quantity_in_stock', fetchedItem.quantity_in_stock.toString());
          setValue('low_stock_threshold', fetchedItem.low_stock_threshold.toString());
        } else {
          throw new Error('No item data in response');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/items?id=${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          is_available: data.is_available,
          special_instructions: data.special_instructions,
          quantity_in_stock: parseInt(data.quantity_in_stock),
          low_stock_threshold: parseInt(data.low_stock_threshold),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }

      toast.success('Item updated successfully');
      router.push('/items');
      router.refresh();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price')}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="quantity_in_stock">Quantity in Stock</Label>
        <Input
          id="quantity_in_stock"
          type="number"
          {...register('quantity_in_stock')}
        />
        {errors.quantity_in_stock && (
          <p className="text-red-500 text-sm">{errors.quantity_in_stock.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
        <Input
          id="low_stock_threshold"
          type="number"
          {...register('low_stock_threshold')}
        />
        {errors.low_stock_threshold && (
          <p className="text-red-500 text-sm">{errors.low_stock_threshold.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="special_instructions">Special Instructions</Label>
        <Textarea id="special_instructions" {...register('special_instructions')} />
        {errors.special_instructions && (
          <p className="text-red-500 text-sm">
            {errors.special_instructions.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is_available" {...register('is_available')} />
        <Label htmlFor="is_available">Available</Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit">Update Item</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/items')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}