'use client';

import { useEffect, useState } from "react"
import { getItem } from "@/lib/services/items"
import { Product } from "@/types/definitions"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { itemEditSchema, ItemEditFormData } from "@/schema-validations/itemEdit"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ProductDetailsForm } from "@/components/admin/items/edit/product-details-form"
import { StockPriceForm } from "@/components/admin/items/edit/stock-price-form"
import { ItemImages } from "@/components/admin/items/edit/item-images"
import { CategoryForm } from "@/components/admin/items/edit/category-form"
import { Header } from "@/components/admin/items/edit/header"

interface EditProductPageProps {
    params: {
        id: string
    }
}

const EditProductPage = ({ params }: EditProductPageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [item, setItem] = useState<Product | null>(null);
    const { id } = params;

    const form = useForm<ItemEditFormData>({
        resolver: zodResolver(itemEditSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            quantity_in_stock: 0,
            low_stock_threshold: 0,
            category_id: 0,
            is_available: true,
            special_instructions: "",
            image_urls: [],
            category_name: "",
            sync_status: false
        }
    });

    useEffect(() => {
        async function loadItem() {
            try {
                setIsLoading(true);
                const { item: fetchedItem, error } = await getItem(id);
                
                if (error) {
                    throw error;
                }

                setItem(fetchedItem);
                // Update form with fetched values
                if (fetchedItem) {
                    form.reset({
                        name: fetchedItem.name,
                        description: fetchedItem.description,
                        price: fetchedItem.price,
                        quantity_in_stock: fetchedItem.quantity_in_stock,
                        low_stock_threshold: fetchedItem.low_stock_threshold,
                        category_id: fetchedItem.category_id,
                        is_available: fetchedItem.is_available,
                        special_instructions: fetchedItem.special_instructions,
                        image_urls: fetchedItem.image_urls,
                        category_name: fetchedItem.category_name,
                        sync_status: fetchedItem.sync_status
                    });
                }
                setError(null);
            } catch (err) {
                console.error('Failed to load item:', err);
                setError('Failed to load item. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }

        loadItem();
    }, [id, form]);

    const onSubmit = async (data: ItemEditFormData) => {
        try {
            console.log('Form data:', data);
            // TODO: Implement update API call
        } catch (err) {
            console.error('Failed to update item:', err);
            setError('Failed to update item. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 mb-4">{error}</div>
                <Link href="/items">
                    <Button variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Items
                    </Button>
                </Link>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-gray-500 mb-4">Item not found</div>
                <Link href="/items">
                    <Button variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Items
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Header form={form} />
                    
                    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                        <div className="space-y-4">
                            <ProductDetailsForm form={form} />
                            <StockPriceForm form={form} />
                        </div>

                        <div className="space-y-4">
                            <ItemImages item={item} />
                            <CategoryForm form={form} />
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default EditProductPage;