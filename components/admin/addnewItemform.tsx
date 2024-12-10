'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { imageSchema } from "@/schema-validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Select, SelectItem } from "../ui/select";
import { SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
type Category = {
    id: number;
    name: string;
};

export const addNewItemSchema = z.object({
    name: z.string()
        .min(4, 'Must be at least 4 characters'), 
    description: z.string()
        .min(20, 'Must be at least 20 characters'), 
    category: z.string()
        .min(1, "Category is required"),
    price: z.preprocess(
      (val) => parseFloat(val as string), 
      z.number()
        .positive('Price must be greater than 0')
        .finite('Invalid price')),
    image: imageSchema.optional()
  })

const AddNewItemForm: React.FC = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const form = useForm<z.infer<typeof addNewItemSchema>>({
        resolver: zodResolver(addNewItemSchema), 
        defaultValues: {
            name: "",
            description: "", 
            category: ""
        }
    })

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            setIsLoading(true);
            const response = await fetch('/api/categories');
            const data = await response.json();
            
            setCategories(data);
          } catch (error) {
            console.error('Error fetching categories:', error);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchCategories();
      }, []);

    const onSubmit = async(data: z.infer<typeof addNewItemSchema>) => {
        const formData = new FormData();
        formData.set('name', data.name); 
        formData.set('description', data.description);
        formData.set('category', data.category);
        formData.set('price', data.price.toString());
        if(data.image) {
            formData.set('image', data.image);
        }
        
        try {
          const response = await fetch('/api/items', {
            method: 'POST',
            body: formData
          });
          
          if(response.ok) {
            toast.success('Item added successfully');
            console.log('Item added successfully');
            router.push('/items')
            router.refresh();
          }
          
        } catch (error) {
            toast.error('Error adding item');
            console.error('Error adding item', error);
        }
    }

    if(isLoading) {
        return <p>Loading...</p>
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input type="text" placeholder="Enter name of Item" {...field} />
                </FormControl> 
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input type="text" placeholder="Enter description of Item" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({field}) => (
              <FormItem className="relative">
                <FormMessage />
                <div className="relative mb-4">
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    onOpenChange={setIsSelectOpen}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent 
                      position="popper"
                      className="w-full z-[100]"
                      align="start"
                      sideOffset={5}
                    >
                      <div className="max-h-[200px] overflow-y-auto">
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.name}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  {isSelectOpen && (
                    <div className="absolute w-full h-[200px] bg-transparent" />
                  )}
                </div>
              </FormItem>
            )}
          />  
          <div style={{ marginTop: isSelectOpen ? '200px' : '0' }} className="transition-all duration-200 space-y-8">
            <FormField
              control={form.control}
              name="price"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input 
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.onChange(file);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full mt-8">Add Item</Button>
        </form>
      </Form>
    )
}

export default AddNewItemForm