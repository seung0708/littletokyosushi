import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { UseFormReturn } from "react-hook-form"
import { ItemEditFormData } from "@/schema-validations/itemEdit"

interface HeaderProps {
    form: UseFormReturn<ItemEditFormData>
}

export function Header({ form }: HeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Link href="/items">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Item</h1>
            </div>
            <div className="flex items-center gap-4">
                <FormField
                    control={form.control}
                    name="is_available"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel className="!m-0">Available</FormLabel>
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </div>
        </div>
    )
}
