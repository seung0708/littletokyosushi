import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { ItemEditFormData } from "@/schema-validations/itemEdit"

interface CategoryFormProps {
    form: UseFormReturn<ItemEditFormData>
}

export function CategoryForm({ form }: CategoryFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="category_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
