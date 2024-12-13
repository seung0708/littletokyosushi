'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectItem } from "../ui/select";
import { SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";

type Category = {
    id: number;
    name: string;
};

const imageSchema =  z.array(
  z.instanceof(File)
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    )
).min(1, "At least one image is required");

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
    images: imageSchema
  })

const AddNewItemForm: React.FC = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof addNewItemSchema>>({
        resolver: zodResolver(addNewItemSchema), 
        defaultValues: {
            name: "",
            description: "", 
            category: ""
        }
    })

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        // Filter for image files
        const imageFiles = files.filter(file => 
            ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
        );

        if (imageFiles.length > 0) {
            form.setValue('images', imageFiles);
            
            // Create preview URLs
            const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues('images') || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        form.setValue('images', newImages);

        // Remove preview and revoke URL
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const onSubmit = async(data: z.infer<typeof addNewItemSchema>) => {
        const formData = new FormData();
        formData.set('name', data.name); 
        formData.set('description', data.description);
        formData.set('category', data.category);
        formData.set('price', data.price.toString());
        if(data.images) {
            data.images.forEach((image) => {
                formData.append('images', image);
            });
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
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Input 
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg"
                      />
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Drag and drop images here, or click to select files</p>
                        <p className="text-xs text-gray-500 mt-1">Supports: PNG, JPEG, JPG</p>
                      </div>
                    </div>
                  </FormControl>
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={preview} className="relative group inline-block">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="h-32 object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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