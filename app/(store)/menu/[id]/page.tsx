'use client'
import {useEffect, useState, use} from 'react';
import { CartItemModifier, CartItemModifierOption } from '@/types/cart';
import { MenuItem, Modifier } from '@/types/item';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCart } from '@/app/context/cartContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loading } from '@/components/ui/loading';

// interface FormModifier {
//     id: number;
//     name: string;
//     min_selections: number;
//     max_selections: number;
//     is_required: boolean;
//     modifier_options: {
//         id: number;
//         modifier_id: number;
//         name: string;
//         price: number;
//     }[];
// }

const formSchema = z.object({
    quantity: z.number().min(1),
    special_instructions: z.string(),
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
                    modifier_option_id: z.number(),
                    name: z.string(),
                    price: z.number()
                })
            )
        })
    )
});

type FormData = z.infer<typeof formSchema>;

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    console.log(params);
    const { id } = use(params);
    const [item, setItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    // const [error, setError] = useState<string | null>(null);
    const { handleCartUpdate } = useCart();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
            modifiers: []
        },
        mode: "onChange"
    });

    const handleModifierChange = (modifierId: number, option: CartItemModifierOption, isSelected: boolean) => {
        const {modifiers} = item!;
        const currentModifiers = form.getValues('modifiers');
        const modifierIndex = currentModifiers.findIndex(m => m.id === modifierId);
        
        if (modifierIndex === -1) return;
        
        const modifier = modifiers?.[modifierIndex];
        const currentOptions = currentModifiers[modifierIndex].modifier_options || [];
        
        let newOptions;
        if (modifier?.max_selections === 1) {
            // Radio button behavior
            newOptions = isSelected ? [option] : [];
        } else {
            // Checkbox behavior
            if (isSelected) {
                if (currentOptions.length < (modifier?.max_selections || 1)) {
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
        if (item?.modifiers) {
            form.setValue('modifiers', item.modifiers.map((mod: Modifier) => ({
                id: mod.id ?? 0,
                menu_item_id: mod.menu_item_id,
                name: mod.name,
                min_selections: mod.min_selections ?? 0,
                max_selections: mod.max_selections ?? 1,
                is_required: mod.is_required ?? false,
                modifier_options: mod.modifier_options?.map(opt => ({
                    id: opt.id ?? 0,
                    name: opt.name,
                    modifier_id: opt.modifier_id,
                    modifier_option_id: opt.id ?? 0,
                    price: opt.price
                })) ?? []
            })));
        }
    }, [item, form]);

    useEffect(() => {
     
        const fetchItem = async () => {
            try {
                setLoading(true);
                console.log('Fetching item with ID:', id);
                const response = await fetch(`/api/store/items/${id}`);
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Response error:', errorText);
                    throw new Error(`Failed to fetch item: ${response.status} ${errorText}`);
                }
                
                const data = await response.json();
                console.log('Received data:', data);
                setItem(data);
                if (!data) {
                    throw new Error('No item data in response');
                }
            } catch (error) {
                console.error('Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id, form]);

   
    const onSubmit = async (data: FormData) => {
        // Validate required selections
        const invalidModifier = data.modifiers.find(mod => 
            mod.is_required && mod.modifier_options.length !== mod.max_selections
        );

        if (invalidModifier) {
            console.error(`Please select exactly ${invalidModifier.max_selections} options for ${invalidModifier.name}`);
            return;
        }

        const cartModifiers: CartItemModifier[] = data.modifiers.map(formMod => {
            const modifier = item?.modifiers?.find(m => m.id === formMod.id);
            if (!modifier) return [];
            return {
                id: modifier.id,
                modifier_id: modifier.id,
                name: modifier.name,
                cart_item_modifier_options: formMod.modifier_options.map(opt => ({
                    modifier_option_id: opt.id,
                    name: opt.name,
                    price: opt.price
                }))
            }
        }).filter(Boolean) as CartItemModifier[];

        const cartItem = {
            menu_item_id: item?.id || 0,
            menu_item_name: item?.name || '',
            menu_item_image: item?.image_urls[0] || '',
            menu_item_price: item?.price || 0,
            base_price: item?.price || 0,
            total_price: (item?.price || 0) * data.quantity,
            quantity: data.quantity,
            special_instructions: data.special_instructions,
            cart_item_modifiers: cartModifiers
        };

        try {
            await handleCartUpdate(cartItem);
            form.reset();
            if (item?.modifiers) {
                form.setValue('modifiers', item.modifiers.map((mod: Modifier) => ({
                    ...mod,
                    min_selections: mod.min_selections || 1,
                    max_selections: mod.max_selections || 1,
                    is_required: mod.is_required || true,
                    modifier_options: [] as {
                        id: number;
                        name: string;
                        modifier_id: number;
                        modifier_option_id: number;
                        price: number;
                    }[]
                })));
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleImageLoad = () => {
        setLoadingImage(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px] py-12">
                <Loading variant="store" size="lg" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="w-full bg-black pt-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400">Loading menu item...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="w-full bg-black pt-20 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Section */}
                        <div className="space-y-6">
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                          border border-white/10">
                                {loadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                        <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[selectedImage]}`}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    onLoad={handleImageLoad}
                                    priority
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                />
                            </div>
                            {item.image_urls.length > 1 && (
                                <div className="flex justify-center space-x-3">
                                    {item.image_urls.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                selectedImage === index 
                                                    ? 'bg-red-500' 
                                                    : 'bg-gray-600 hover:bg-gray-500'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="lg:pt-8">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">{item.name}</h1>
                                    <p className="text-gray-400 text-base sm:text-lg">{item.description}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xl sm:text-2xl font-bold text-red-400">
                                        ${item.price.toFixed(2)}
                                    </div>
                                </div>

                                <Form {...form}>
                                    <form 
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const data = form.getValues();
                                            onSubmit(data);
                                        }} 
                                        className="space-y-8"
                                    >
                                        <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                                      border border-white/10 rounded-xl p-4 sm:p-6">
                                            <FormField
                                                control={form.control}
                                                name="quantity"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg font-medium mb-3">Quantity</FormLabel>
                                                        <div className="flex items-center space-x-4 bg-black/20 rounded-lg p-2 w-fit">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 text-gray-300 hover:text-white hover:bg-black/30"
                                                                onClick={() => {
                                                                    const newQuantity = Math.max(1, field.value - 1);
                                                                    form.setValue('quantity', newQuantity);
                                                                }}
                                                            >
                                                                <MinusIcon className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-8 text-center text-lg">{field.value}</span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 text-gray-300 hover:text-white hover:bg-black/30"
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
                                        </div>

                                        {item.modifiers?.map((modifier, index) => (
                                            <div key={modifier.id} 
                                                 className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                                          border border-white/10 rounded-xl p-4 sm:p-6 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <FormLabel className="text-lg font-medium">{modifier.name}</FormLabel>
                                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                                        modifier.is_required 
                                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                    }`}>
                                                        {modifier.is_required ? 'Required' : 'Optional'}
                                                    </span>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name={`modifiers.${index}.modifier_options`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                {modifier.max_selections === 1 ? (
                                                                    <RadioGroup
                                                                        value={field.value?.[0]?.id?.toString() || ''}
                                                                        onValueChange={(value) => {
                                                                            const selectedOption = modifier?.modifier_options?.find(
                                                                                opt => opt.id.toString() === value
                                                                            );
                                                                            if (selectedOption) {
                                                                                handleModifierChange(
                                                                                    modifier.id,
                                                                                    selectedOption,
                                                                                    true
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="space-y-3"
                                                                    >
                                                                        {modifier?.modifier_options?.map((option) => (
                                                                            <div key={option.id} 
                                                                                 className="flex items-center space-x-3 bg-black/20 rounded-lg p-3 
                                                                                          hover:bg-black/30 transition-colors">
                                                                                <RadioGroupItem 
                                                                                    value={option.id.toString()} 
                                                                                    id={`${modifier.id}-${option.id}`}
                                                                                    className="border-white/20"
                                                                                />
                                                                                <Label 
                                                                                    htmlFor={`${modifier.id}-${option.id}`} 
                                                                                    className="flex justify-between w-full text-sm sm:text-base"
                                                                                >
                                                                                    <span>{option.name}</span>
                                                                                    <span className="text-red-400">+${option.price.toFixed(2)}</span>
                                                                                </Label>
                                                                            </div>
                                                                        ))}
                                                                    </RadioGroup>
                                                                ) : (
                                                                    <div className="space-y-3">
                                                                        {modifier?.modifier_options?.map((option) => {
                                                                            const isSelected = (field.value || []).some(opt => opt.id === option.id);
                                                                            const atMaxSelections = (field.value || []).length >= (modifier?.max_selections || 1);
                                                                            const isDisabled = !isSelected && atMaxSelections;
                                                                            
                                                                            return (
                                                                                <div key={option.id} 
                                                                                     className={`flex items-center space-x-3 bg-black/20 rounded-lg p-3 
                                                                                              transition-colors ${
                                                                                                  isDisabled 
                                                                                                      ? 'opacity-50 cursor-not-allowed' 
                                                                                                      : 'hover:bg-black/30'
                                                                                              }`}>
                                                                                    <Checkbox
                                                                                        id={`${modifier.id}-${option.id}`}
                                                                                        checked={isSelected}
                                                                                        disabled={isDisabled}
                                                                                        onCheckedChange={(checked) => {
                                                                                            handleModifierChange(
                                                                                                modifier.id,
                                                                                                option,
                                                                                                checked as boolean
                                                                                            );
                                                                                        }}
                                                                                        className="border-white/20"
                                                                                    />
                                                                                    <Label 
                                                                                        htmlFor={`${modifier.id}-${option.id}`}
                                                                                        className="flex justify-between w-full text-sm sm:text-base"
                                                                                    >
                                                                                        <span>{option.name}</span>
                                                                                        <span className="text-red-400">+${option.price.toFixed(2)}</span>
                                                                                    </Label>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}

                                        <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm 
                                                      border border-white/10 rounded-xl p-4 sm:p-6">
                                            <FormField
                                                control={form.control}
                                                name="special_instructions"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg font-medium mb-3">Special Instructions</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                placeholder="Any special requests?"
                                                                className="bg-black/20 border-white/10 resize-none focus:ring-red-500"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button 
                                            type="submit" 
                                            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                                            disabled={!isFormValid()}
                                        >
                                            Add to Cart
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}