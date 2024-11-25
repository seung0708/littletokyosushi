import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
const formSchema = z.object({
    name: z.string(), 
    description: z.string(),
    price: z.number(),
    category: z.string()
})

export default function AddItem() {

    const onSumbit = (values: z.infer<typeof formSchema>) => {
        
    }
    return (
        <Form>
            <form onSubmit={for}>
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