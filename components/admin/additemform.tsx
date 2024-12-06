import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ItemFormData } from "@/types/definitions";
import { useForm } from "react-hook-form";
import { z, ZodType } from 'zod';

export const ItemSchema: ZodType<ItemFormData> = z
    .object({
        item_name: z.string(), 
        image_url: 
        description: z.string(), 
    })

export default function AddItem() {
    const {register, handleSubmit, formState: {errors}, setError} = useForm<FormData>();
    return (
        <Form>
            <form>
            <FormField />
                <FormItem>
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                        <Input />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Description:</FormLabel>
                    <FormControl>
                        <Input />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Price:</FormLabel>
                    <FormControl>
                        <Input />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Category Name:</FormLabel>
                    <FormControl>
                        <Input />
                    </FormControl>
                </FormItem>
            </form>
        </Form>
    )
}