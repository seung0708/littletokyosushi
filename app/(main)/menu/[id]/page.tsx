'use client'
import {useEffect, useState} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Item } from '@/types/definitions';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MinusIcon, PlusIcon } from "lucide-react";

type Modifiers = {
    id: number;
    name: string;
    min_selections: number;
    max_selections: number;
    is_required: boolean;
    modifier_options: {
        id: number;
        name: string;
        price: number;
    }[];
};

type FormData = {
    quantity: string;
    modifiers: Array<{
        selectedOptions: string[];
    }>;
};

const ItemDetailsPage: React.FC= () => {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [modifiers, setModifiers] = useState<Modifiers[]>([]);
    const [loadingImage, setLoadingImage] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const {id} = useParams()
    const itemId = Number(id);

    const form = useForm<FormData>({
        defaultValues: {
            quantity: "1",
            modifiers: modifiers?.map(modifier => ({
                selectedOptions: []
            })) || []
        },
        resolver: async (values) => {
            const errors: Record<string, any> = {};

            if (!values.quantity || parseInt(values.quantity) < 1) {
                errors.quantity = {
                    type: 'required',
                    message: 'Please enter a valid quantity'
                };
            }

            // Only validate modifiers if they exist
            if (modifiers && modifiers.length > 0) {
                modifiers.forEach((modifier, index) => {
                    const selectionCount = values.modifiers?.[index]?.selectedOptions?.length || 0;

                    if (modifier.is_required && selectionCount === 0) {
                        if (!errors.modifiers) errors.modifiers = {};
                        if (!errors.modifiers[index]) errors.modifiers[index] = {};
                        errors.modifiers[index].selectedOptions = {
                            type: 'required',
                            message: 'This modifier is required'
                        };
                        return false;
                    }

                    if (selectionCount < modifier.min_selections) {
                        if (!errors.modifiers) errors.modifiers = {};
                        if (!errors.modifiers[index]) errors.modifiers[index] = {};
                        errors.modifiers[index].selectedOptions = {
                            type: 'min',
                            message: `Please select at least ${modifier.min_selections} option${modifier.min_selections > 1 ? 's' : ''}`
                        };
                        return false;
                    }

                    if (selectionCount > modifier.max_selections) {
                        if (!errors.modifiers) errors.modifiers = {};
                        if (!errors.modifiers[index]) errors.modifiers[index] = {};
                        errors.modifiers[index].selectedOptions = {
                            type: 'max',
                            message: `Please select at most ${modifier.max_selections} option${modifier.max_selections > 1 ? 's' : ''}`
                        };
                        return false;
                    }
                });
            }

            return {
                values,
                errors: Object.keys(errors).length > 0 ? errors : {}
            };
        }
    });

    useEffect(() => {
        if (modifiers.length > 0) {
            console.log('Setting default modifiers:', modifiers);
            const defaultModifiers = modifiers.map(modifier => ({
                selectedOptions: []
            }));
            form.reset({
                quantity: "1",
                modifiers: defaultModifiers,
            });
        }
    }, [modifiers, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            console.log('Form values changed:', value);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        const fetchItem = async () => {
            try {
              setLoading(true);
              const response = await fetch(`/api/main/items/${itemId}`, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
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
        fetchItem();
    },[])

    useEffect(() => {
        const fetchModifiers = async () => {
            try {
              setLoading(true);
              const response = await fetch(`/api/modifiers/${itemId}`, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const data = await response.json();
              console.log('Modifier data:', data);
              setModifiers(data);
              console.log('Fetched modifiers data:', data);  
              
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
        }    
        fetchModifiers()
    }, []);

    const onSubmit = (data: FormData) => {
        console.log('Form submitted:', {
            itemId: itemId,
            quantity: parseInt(data.quantity),
            modifierSelections: modifiers ? data.modifiers.map((mod, index) => {
                const selectedOptions = mod.selectedOptions.map(optionId => {
                    const option = modifiers[index].modifier_options.find(opt => opt.id.toString() === optionId);
                    return {
                        optionId: parseInt(optionId),
                        price: option?.price || 0
                    };
                });
                return {
                    modifierId: modifiers[index].id,
                    selectedOptions
                };
            }) : []
        });
    };

    const handleImageLoad = () => {
        setLoadingImage(false);
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {item?.image_urls && item.image_urls[selectedImage] ? (
                            <>
                                {loadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                    </div>
                                )}
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[selectedImage]}`}
                                    alt={`${item?.name} - View ${selectedImage + 1}`}
                                    width={500}
                                    height={500}
                                    className={`object-cover transition-opacity duration-300 ${loadingImage ? 'opacity-0' : 'opacity-100'}`}
                                    onLoad={handleImageLoad}
                                    priority={selectedImage === 0}
                                />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <span className="text-gray-400">No image available</span>
                            </div>
                        )}
                    </div>
                    {item?.image_urls && item.image_urls.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {item.image_urls.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImage(index);
                                        setLoadingImage(true);
                                    }}
                                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all
                                        ${selectedImage === index 
                                            ? 'border-primary ring-2 ring-primary ring-offset-2' 
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${image}`}
                                        alt={`${item.name} thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 20vw, 10vw"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-col space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{item?.name}</h1>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-semibold">${item?.price.toFixed(2)}</p>
                        </div>
                        <p className="text-gray-500 leading-relaxed">{item?.description}</p>
                    </div>

                    <Separator className="my-4" />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                {modifiers.map((modifier, index) => (
                                    <FormField
                                        key={modifier.id}
                                        control={form.control}
                                        name={`modifiers.${index}.selectedOptions`}
                                        defaultValue={[]}
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-base font-semibold">
                                                    {modifier.name} 
                                                    <span className={`ml-2 text-sm ${modifier.is_required ? 'text-red-500' : 'text-gray-500'}`}>
                                                        {modifier.is_required ? '(Required)' : '(Optional)'} 
                                                        {modifier.max_selections > 1 && ` • Select ${modifier.min_selections}-${modifier.max_selections}`}
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    {modifier.max_selections === 1 ? (
                                                        <div className="space-y-2">
                                                            {modifier.modifier_options.map((option) => {
                                                                const isSelected = field.value?.[0] === option.id.toString();
                                                                return (
                                                                    <Button
                                                                        key={option.id}
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => field.onChange([option.id.toString()])}
                                                                        className={`w-full justify-start space-x-3 ${
                                                                            isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                                                                        }`}
                                                                    >
                                                                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                                                            isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                                                                        }`}>
                                                                            {isSelected && (
                                                                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-1 items-center justify-between">
                                                                            <span>{option.name}</span>
                                                                            <span className="text-sm text-gray-500">
                                                                                {`+$${option.price.toFixed(2)}`}
                                                                            </span>
                                                                        </div>
                                                                    </Button>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {modifier.modifier_options.map((option) => {
                                                                console.log('Checkbox option price:', option.price);
                                                                const selectedOptions = Array.isArray(field.value) ? field.value : [];
                                                                const isChecked = selectedOptions.includes(option.id.toString());
                                                                const atMaxSelections = selectedOptions.length >= (modifier.max_selections || 0);
                                                                
                                                                return (
                                                                    <Button
                                                                        key={option.id}
                                                                        type="button"
                                                                        variant="outline"
                                                                        disabled={!isChecked && atMaxSelections}
                                                                        onClick={() => {
                                                                            const value = option.id.toString();
                                                                            if (isChecked) {
                                                                                field.onChange(selectedOptions.filter(v => v !== value));
                                                                            } else if (!atMaxSelections) {
                                                                                const newSelection = [...selectedOptions, value];
                                                                                if (newSelection.length <= (modifier.max_selections || 0)) {
                                                                                    field.onChange(newSelection);
                                                                                }
                                                                            }
                                                                        }}
                                                                        className={`w-full justify-start space-x-3 ${
                                                                            isChecked ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                                                                        } ${atMaxSelections && !isChecked ? 'opacity-50' : ''}`}
                                                                    >
                                                                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                                                                            isChecked ? 'border-primary bg-primary' : 'border-gray-300'
                                                                        }`}>
                                                                            {isChecked && (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="h-3 w-3 text-white"
                                                                                >
                                                                                    <polyline points="20 6 9 17 4 12" />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-1 items-center justify-between">
                                                                            <span>{option.name}</span>
                                                                            <span className="text-sm text-gray-500">
                                                                                {`+$${option.price.toFixed(2)}`}
                                                                            </span>
                                                                        </div>
                                                                    </Button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">Quantity</FormLabel>
                                            <FormControl>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <Label htmlFor="quantity">Quantity</Label>
                                                        <div className="flex items-center">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-r-none"
                                                                onClick={() => {
                                                                    const currentQty = parseInt(form.getValues('quantity'));
                                                                    if (currentQty > 1) {
                                                                        form.setValue('quantity', (currentQty - 1).toString());
                                                                    }
                                                                }}
                                                            >
                                                                <MinusIcon className="h-4 w-4" />
                                                            </Button>
                                                            <Input
                                                                type="number"
                                                                id="quantity"
                                                                min="1"
                                                                className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                                {...form.register('quantity')}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-l-none"
                                                                onClick={() => {
                                                                    const currentQty = parseInt(form.getValues('quantity'));
                                                                    form.setValue('quantity', (currentQty + 1).toString());
                                                                }}
                                                            >
                                                                <PlusIcon className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6"
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

export default ItemDetailsPage