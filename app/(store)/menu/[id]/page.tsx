'use client'
import {useEffect, useState} from 'react';
import { Item, Modifier } from '@/types/definitions';
import { CartItem, CartItemModifier, CartItemModifierOption } from '@/app/context/cartContext';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCart } from '@/app/context/cartContext';
import { useAuth } from '@/app/context/authContext';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormModifier {
    id: number;
    name: string;
    selectedOptions: number[];
}

const formSchema = z.object({
    quantity: z.number().min(1),
    modifiers: z.array(z.object({
        id: z.number(),
        name: z.string(),
        selectedOptions: z.array(z.number()).default([])
    }))
});

type FormData = z.infer<typeof formSchema>;

export default function ItemDetailsPage({ params }: { params: { id: string } }) {
    const [item, setItem] = useState<Item | null>(null);
    const [modifiers, setModifiers] = useState<Modifier[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingImage, setLoadingImage] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItemToCart } = useCart();
    const { user } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
            modifiers: []
        }
    });

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/store/items/${params.id}`);
                if (!response.ok) throw new Error('Failed to fetch item');
                const data = await response.json();
                const fetchedItem = data.item;
                if (!fetchedItem) {
                    throw new Error('No item data in response');
                }
                setItem(fetchedItem);
            } catch (error) {
                console.error('Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchModifiers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/modifiers/${params.id}`);
                if (!response.ok) throw new Error('Failed to fetch modifiers');
                const data = await response.json();
                setModifiers(data);
                
                // Initialize form with modifiers
                const defaultModifiers = data.map((mod: Modifier) => ({
                    id: mod.id,
                    name: mod.name,
                    selectedOptions: []
                }));
                form.setValue('modifiers', defaultModifiers);
            } catch (error) {
                console.error('Error fetching modifiers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
        fetchModifiers();
    }, [params.id, form]);

    const calculateTotalPrice = (basePrice: number, quantity: number, formModifiers: FormModifier[]) => {
        const modifierPrice = formModifiers.reduce((total, formMod) => {
            // Find the actual modifier with options from the state
            const modifier = modifiers.find(m => m.id === formMod.id);
            if (!modifier) return total;

            return total + formMod.selectedOptions.reduce((sum, optId) => {
                const modifierOption = modifier.modifier_options.find(opt => opt.id === optId);
                return sum + (modifierOption?.price || 0);
            }, 0);
        }, 0);

        return (basePrice + modifierPrice) * quantity;
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (!item) {
                throw new Error('Menu item not found');
            }

            const cartModifiers: CartItemModifier[] = data.modifiers.map(formMod => {
                const modifier = modifiers.find(m => m.id === formMod.id);
                if (!modifier) {
                    throw new Error(`Modifier ${formMod.id} not found`);
                }
                
                const selectedModifierOptions: CartItemModifierOption[] = modifier.modifier_options
                    .filter(opt => formMod.selectedOptions.includes(opt.id))
                    .map(opt => ({
                        id: opt.id,
                        name: opt.name,
                        price: opt.price
                    }));

                return {
                    id: modifier.id,
                    name: modifier.name,
                    min_selections: modifier.min_selections,
                    max_selections: modifier.max_selections,
                    is_required: modifier.is_required,
                    modifier_options: selectedModifierOptions
                };
            });

            const cartItem: CartItem = {
                menu_item_id: item.id,
                quantity: data.quantity,
                base_price: item.price,
                total_price: calculateTotalPrice(item.price, data.quantity, data.modifiers),
                modifiers: cartModifiers
            };

            console.log('Submitting cart item:', cartItem);
            await addItemToCart(cartItem);
            
            // Reset form
            form.reset();
            console.log('Item added to cart successfully');
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleModifierChange = (modifierId: number, optionId: number, isSelected: boolean) => {
        const currentModifiers = form.getValues('modifiers');
        const modifierIndex = currentModifiers.findIndex(m => m.id === modifierId);
        
        if (modifierIndex === -1) return;
        
        const currentModifier = modifiers.find(m => m.id === modifierId);
        if (!currentModifier) return;

        let currentSelections = currentModifiers[modifierIndex].selectedOptions || [];
        let newSelections: number[];

        if (isSelected) {
            // Add the new selection if we're below max_selections
            if (currentSelections.length < currentModifier.max_selections) {
                newSelections = [...currentSelections, optionId];
            } else {
                return; // Don't update if we're at max selections
            }
        } else {
            // Remove the selection if we're above min_selections
            if (currentSelections.length > currentModifier.min_selections) {
                newSelections = currentSelections.filter(id => id !== optionId);
            } else {
                return; // Don't update if we're at min selections
            }
        }

        // Update the form with new selections
        const updatedModifiers = [...currentModifiers];
        updatedModifiers[modifierIndex] = {
            ...currentModifiers[modifierIndex],
            selectedOptions: newSelections
        };
        form.setValue('modifiers', updatedModifiers);
        
        // Force a re-render to update UI
        form.trigger('modifiers');
    };

    const handleImageLoad = () => {
        setLoadingImage(false);
    };

    if (loading || !item) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                    {loadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[selectedImage]}`}
                        alt={item.name}
                        width={500}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-lg"
                        onLoad={handleImageLoad}
                    />
                    {item.image_urls.length > 1 && (
                        <div className="flex mt-4 space-x-2">
                            {item.image_urls.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-3 h-3 rounded-full ${
                                        selectedImage === index ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <p className="text-2xl font-bold mb-6">${item.price.toFixed(2)}</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <div className="flex items-center space-x-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    const newQuantity = Math.max(1, field.value - 1);
                                                    form.setValue('quantity', newQuantity);
                                                }}
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </Button>
                                            <span className="text-xl font-semibold">{field.value}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    const newQuantity = field.value + 1;
                                                    form.setValue('quantity', newQuantity);
                                                }}
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {modifiers.map((modifier, index) => (
                                <div key={modifier.id} className="space-y-4">
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <FormLabel>{modifier.name}</FormLabel>
                                        <span className="text-sm text-gray-500">
                                            {modifier.is_required ? 'Required' : 'Optional'} •{' '}
                                            {modifier.min_selections === modifier.max_selections
                                                ? `Select ${modifier.min_selections}`
                                                : `Select ${modifier.min_selections}-${modifier.max_selections}`}
                                        </span>
                                    </div>
                                    {modifier.max_selections === 1 ? (
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                const optionId = parseInt(value);
                                                const currentModifiers = form.getValues('modifiers');
                                                const updatedModifiers = [...currentModifiers];
                                                updatedModifiers[index] = {
                                                    ...currentModifiers[index],
                                                    selectedOptions: [optionId]
                                                };
                                                form.setValue('modifiers', updatedModifiers);
                                            }}
                                        >
                                            {modifier.modifier_options.map((option) => (
                                                <div key={option.id} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                                                    <label htmlFor={`option-${option.id}`} className="flex justify-between w-full">
                                                        <span>{option.name}</span>
                                                        {option.price > 0 && <span>+${option.price.toFixed(2)}</span>}
                                                    </label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    ) : (
                                        <div className="space-y-2">
                                            {modifier.modifier_options.map((option) => {
                                                const currentSelections = form.getValues(`modifiers.${index}.selectedOptions`) || [];
                                                const isSelected = currentSelections.includes(option.id);
                                                const atMaxSelections = currentSelections.length >= modifier.max_selections;
                                                const isDisabled = !isSelected && atMaxSelections;
                                                
                                                return (
                                                    <div key={option.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`option-${option.id}`}
                                                            checked={isSelected}
                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                handleModifierChange(modifier.id, option.id, checked as boolean);
                                                            }}
                                                        />
                                                        <label 
                                                            htmlFor={`option-${option.id}`} 
                                                            className={`flex justify-between w-full ${isDisabled ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                                        >
                                                            <span>{option.name}</span>
                                                            {option.price > 0 && <span>+${option.price.toFixed(2)}</span>}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Button type="submit" className="w-full">
                                Add to Cart
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}