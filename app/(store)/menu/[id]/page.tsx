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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';

interface FormModifier {
    id: number;
    name: string;
    min_selections: number;
    max_selections: number;
    is_required: boolean;
    modifier_options: {
        id: number;
        modifier_id: number;
        name: string;
        price: number;
    }[];
}

const formSchema = z.object({
    quantity: z.number().min(1),
    modifiers: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            min_selections: z.number(),
            max_selections: z.number(),
            is_required: z.boolean(),
            modifier_options: z.array(
                z.object({
                    id: z.number(),
                    modifier_id: z.number(),
                    name: z.string(),
                    price: z.number()
                })
            )
        })
    )
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
            modifiers: []
        },
        mode: "onChange"
    });

    const handleModifierChange = (modifierId: number, option: any, isSelected: boolean) => {
        const currentModifiers = form.getValues('modifiers');
        const modifierIndex = currentModifiers.findIndex(m => m.id === modifierId);
        
        if (modifierIndex === -1) return;
        
        const modifier = modifiers[modifierIndex];
        const currentOptions = currentModifiers[modifierIndex].modifier_options || [];
        
        let newOptions;
        if (modifier.max_selections === 1) {
            // Radio button behavior
            newOptions = isSelected ? [option] : [];
        } else {
            // Checkbox behavior
            if (isSelected) {
                if (currentOptions.length < modifier.max_selections) {
                    newOptions = [...currentOptions, option];
                } else {
                    return; // Max selections reached
                }
            } else {
                newOptions = currentOptions.filter(opt => opt.id !== option.id);
            }
        }
        
        const updatedModifiers = [...currentModifiers];
        updatedModifiers[modifierIndex] = {
            ...currentModifiers[modifierIndex],
            modifier_options: newOptions
        };
        
        form.setValue('modifiers', updatedModifiers, { shouldValidate: true });
    };

    const isFormValid = () => {
        const formValues = form.getValues();
        return formValues.modifiers.every(mod => {
            if (mod.is_required) {
                return mod.modifier_options.length === mod.max_selections;
            }
            return true;
        });
    };

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
                const data = await response.json();
                setModifiers(data);
                
                // Initialize form with empty modifier_options arrays
                const initialModifiers = data.map((mod: Modifier) => ({
                    id: mod.id,
                    name: mod.name,
                    min_selections: mod.min_selections,
                    max_selections: mod.max_selections,
                    is_required: mod.is_required,
                    modifier_options: []
                }));
                
                form.reset({
                    quantity: 1,
                    modifiers: initialModifiers
                });
            } catch (error) {
                console.error('Error fetching modifiers:', error);
            }
        };

        fetchItem();
        if (params.id) {
            fetchModifiers();
        }
    }, [params.id, form]);

    const calculateTotalPrice = (basePrice: number, quantity: number, modifiers: FormModifier[]) => {
        const modifierPrice = modifiers.reduce((total, mod) => {
            return total + mod.modifier_options.reduce((optTotal, opt) => optTotal + opt.price, 0);
        }, 0);
        return (basePrice + modifierPrice) * quantity;
    };

    const onSubmit = async (data: FormData) => {
        console.log('onSubmit executing with data:', data);
        
        // Validate required selections
        const invalidModifier = data.modifiers.find(mod => 
            mod.is_required && mod.modifier_options.length !== mod.max_selections
        );

        if (invalidModifier) {
            console.error(`Please select exactly ${invalidModifier.max_selections} options for ${invalidModifier.name}`);
            return;
        }

        if (!item) {
            console.error('Menu item not found');
            return;
        }

        const cartModifiers: CartItemModifier[] = data.modifiers.map(formMod => {
            const modifier = modifiers.find(m => m.id === formMod.id);
            if (!modifier) return null;
            return {
                id: modifier.id,
                name: modifier.name,
                min_selections: modifier.min_selections,
                max_selections: modifier.max_selections,
                is_required: modifier.is_required,
                modifier_options: formMod.modifier_options.map(opt => ({
                    id: opt.id,
                    modifier_id: opt.modifier_id,
                    name: opt.name,
                    price: opt.price
                }))
            };
        }).filter(Boolean) as CartItemModifier[];

        const cartItem: CartItem = {
            menu_item_id: item.id,
            quantity: data.quantity,
            base_price: item.price,
            total_price: calculateTotalPrice(item.price, data.quantity, data.modifiers),
            modifiers: cartModifiers
        };

        try {
            console.log('Adding item to cart:', cartItem);
            await addItemToCart(cartItem);
            form.reset();
            console.log('Item added to cart successfully');
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
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
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const data = form.getValues();
                                console.log('Form submitted with data:', data);
                                onSubmit(data);
                            }} 
                            className="space-y-6"
                        >
                        {modifiers.map((modifier, index) => (
                        <div key={modifier.id} className="space-y-4">
                            <Separator />
                            <div className="flex justify-between items-center">
                                <FormLabel>{modifier.name}</FormLabel>
                                    <p className="text-sm text-gray-500">
                                        {modifier.is_required ? (
                                    <span>
                                        Required
                                    </span>
                                    ) : (
                                        <span>Optional</span>
                                    )}
                                    </p>
                            </div>
                            <FormField
                                control={form.control}
                                name={`modifiers.${index}.modifier_options`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                        {modifier.max_selections === 1 ? (
                                            <RadioGroup
                                                value={field.value[0]?.id?.toString() || ''}
                                                onValueChange={(value) => {
                                                    const option = modifier.modifier_options.find(
                                                        opt => opt.id.toString() === value
                                                    );
                                                    if (option) {
                                                        handleModifierChange(modifier.id, option, true);
                                                    }
                                                }}
                                            >
                                            {modifier.modifier_options.map((option) => (
                                                <div key={option.id} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option.id.toString()} id={`${modifier.id}-${option.id}`} />
                                                    <Label htmlFor={`${modifier.id}-${option.id}`} className="flex justify-between w-full">
                                                        <span>{option.name}</span>
                                                        {option.price > 0 && <span>+${option.price.toFixed(2)}</span>}
                                                    </Label>
                                                </div>
                                            ))}
                                            </RadioGroup>
                                        ) : (
                                            <div className="space-y-2">
                                            {modifier.modifier_options.map((option) => {
                                                const formValues = form.getValues();
                                                const currentModifier = formValues.modifiers[index];
                                                const currentOptions = currentModifier?.modifier_options || [];
                                                const isSelected = currentOptions.some(opt => opt.id === option.id);
                                                const atMaxSelections = currentOptions.length >= modifier.max_selections;
                                                const isDisabled = !isSelected && atMaxSelections;

                                                return (
                                                    <div key={option.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`option-${option.id}`}
                                                            checked={isSelected}
                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                handleModifierChange(modifier.id, option, checked);
                                                            }}
                                                        />
                                                        <Label
                                                            htmlFor={`option-${option.id}`}
                                                            className={`flex justify-between w-full ${isDisabled ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                                        >
                                                            <span>{option.name}</span>
                                                            {option.price > 0 && <span>+${option.price.toFixed(2)}</span>}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                            </div>
                                        )}
                                        </FormControl>
                                        <div className="text-sm text-red-500 mt-1">
                                            {modifier.is_required && field.value.length < modifier.min_selections && (
                                                <span>Please select at least {modifier.min_selections} option{modifier.min_selections > 1 ? 's' : ''}</span>
                                            )}
                                            {field.value.length > modifier.max_selections && (
                                                <span>Cannot select more than {modifier.max_selections} option{modifier.max_selections > 1 ? 's' : ''}</span>
                                            )}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        ))}
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={!isFormValid()}
                        >
                            Add to Cart
                        </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}