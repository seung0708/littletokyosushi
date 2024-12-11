import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UseFormReturn } from "react-hook-form"
import { ItemEditFormData } from "@/schema-validations/itemEdit"

interface StockPriceFormProps {
    form: UseFormReturn<ItemEditFormData>
}

export function StockPriceForm({ form }: StockPriceFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Stock & Price</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Stock</TableHead>
                            <TableHead>Low Stock Threshold</TableHead>
                            <TableHead>Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name="quantity_in_stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input 
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name="low_stock_threshold"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input 
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input 
                                                    type="number"
                                                    step="0.01"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
