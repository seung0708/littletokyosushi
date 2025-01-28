'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function PrepTimeForm({order}: {order: any}, onSubmit: () => void) {
    const [lastChanged, setLastChanged] = useState<number | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const prepTimeSchema = z.object({
        prepTime: z.number()
          .min(5, "Prep time must be at least 5 minutes")
          .max(180, "Prep time cannot exceed 180 minutes"),
      })
    
    const form = useForm<z.infer<typeof prepTimeSchema>>({
        resolver: zodResolver(prepTimeSchema),
        defaultValues: {
          prepTime: order.prepTime || 10
        },
      })


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="prepTime"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel>Prep Time (minutes)</FormLabel>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-r-none h-10"
                                                    onClick={() => {
                                                        const newValue = Math.max(5, (field.value || 0) - 5);
                                                        field.onChange(newValue);
                                                        setLastChanged(newValue);
                                                    }}
                                                >
                                                    -
                                                </Button>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        min={5}
                                                        max={60}
                                                        step={5}
                                                        className="rounded-none w-[80px] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = Math.round(e.target.valueAsNumber / 5) * 5;
                                                            field.onChange(value);
                                                            setLastChanged(value);
                                                        }}      
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-l-none h-10"
                                                    onClick={() => {
                                                      const newValue = Math.min(180, (field.value || 0) + 5);
                                                      field.onChange(newValue);
                                                      setLastChanged(newValue);
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>
        </Form>
    )
}
