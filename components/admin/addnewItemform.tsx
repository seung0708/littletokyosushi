'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { imageSchema } from "@/app/admin/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "@/app/main/components/ui/buttons";
import { fetchCategoryId, uploadImage, insertMenuItem } from "@/app/admin/lib/supabase/items-data";


export const addNewItemSchema = z.object({
    name: z.string()
        .min(4, 'Must be at least 4 characters'), 
    description: z.string()
        .min(20, 'Must be at least 20 characters'), 
    category: z.string(),
    price: z.preprocess((val) => parseFloat(val as string), z.number().positive().finite()),
    image: imageSchema
})

const AddNewItemForm: React.FC = () => {
    const form = useForm<z.infer<typeof addNewItemSchema>>({
        resolver: zodResolver(addNewItemSchema), 
        defaultValues: {
            name: "",
            description: "", 
            category: ""
        }
    })

    const onSubmit = async(data: z.infer<typeof addNewItemSchema>) => {
        const formData = new FormData();
        formData.set('name', data.name); 
        formData.set('description', data.description);
        formData.set('category', data.category)
        formData.set('price', data.price.toString())
        formData.set('image', data.image); 

        try {
            const newItem = {
                name: formData.get('name') as string, 
                description: formData.get('description') as string, 
                category: formData.get('category') as string, 
                price: formData.get('price'),
                image: formData.get('image') as File

            }

            const categoryId = await fetchCategoryId(newItem.category); 
        } catch(error: any) {
            
        }
    }

    return (
        <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input  
                        type="text"
                        {...field} 
                      />
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
                    <FormControl>
                      <Input 
                        type="text"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="category"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input 
                        type="text"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="price"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field} 
                      />
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
                    <FormControl>
                      <Input 
                        type="file"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-3 ">Submit</Button>
              </form>
            </Form>
    )
}

export default AddNewItemForm