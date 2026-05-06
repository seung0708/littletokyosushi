'use client';
import { useForm } from 'react-hook-form';
import { useCart } from '@/app/context/cartContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { MenuItem, ModifierGroup, ModifierOption } from '@/types/item';
import { CartItemModifier } from '@/types/cart';
import { Loading } from '@/components/ui/loading';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MinusIcon, PlusIcon } from "lucide-react";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useToast } from '@/app/context/toastContext';
import { AddToCartButton } from '@/components/ui/loadingButtons';
import { useBackButton } from '@/app/hooks/useBackButton';


const formSchema = z.object({
    quantity: z.number().min(1),
    special_instructions: z.string(),
    modifier_groups: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            min_sel: z.number(),
            max_sel: z.number(),
            is_required: z.boolean(),
            modifier_options: z.array(
                z.object({
                    id: z.string(),
                    modifier_group_id: z.number(),
                    name: z.string(),
                    price: z.number()
                })
            )
        })
    )
});

type FormData = z.infer<typeof formSchema>;

export default function ItemDetailsForm({initialItem}) {
    const { showToast } = useToast();
    const { handleCartUpdate } = useCart(); 
    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [item] = useState<MenuItem>(initialItem);
    const router = useBackButton(() => {
        if(form.formState.isDirty) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
            if (!confirmed) {
                // Prevent navigation
                window.history.pushState(null, '', window.location.href);
                return;
            }
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
            modifier_groups: []
        },
        mode: "onChange"
    });

    const handleModifierChange = (modifierId: string, option: ModifierOption, isSelected: boolean) => {
        const {modifier_groups} = item;
        const currentModifiers = form.getValues('modifier_groups');
        const modifierIndex = currentModifiers.findIndex(m => m.id === modifierId);
    
        if (modifierIndex === -1) return;
        
        const modifierGroup = modifier_groups?.[modifierIndex];
        const currentOptions = currentModifiers[modifierIndex].modifier_options || [];
        
        let newOptions;
        if (modifierGroup?.max_sel === 1) {
            // Radio button behavior
            newOptions = isSelected ? [option] : [];
        } else {
            // Checkbox behavior
            if (isSelected) {
                if (currentOptions.length < (modifierGroup?.max_sel || 1)) {
                    newOptions = [...currentOptions, option];
                } else {
                    return; // Max selections reached
                }
            } else {
                newOptions = currentOptions.filter(opt => opt.id !== option.id);
            }
        }
        
        const updatedModifierGroups = [...currentModifiers];
        updatedModifierGroups[modifierIndex] = {
            ...currentModifiers[modifierIndex],
            modifier_options: newOptions
        };
        
        form.setValue('modifier_groups', updatedModifierGroups, { shouldValidate: true });
        showToast('Modifier updated successfully!', 'success');
    }

    const isFormValid = () => {
        const formValues = form.getValues();
        return formValues.modifier_groups.every(mod => {
            if (mod.is_required) {
                return mod.modifier_options.length === mod.max_sel;
            }
            return true;
        });
    };

    useEffect(() => {
        if (item?.modifier_groups) {
            form.setValue('modifier_groups', item.modifier_groups.map((mod: ModifierGroup) => ({
                id: mod.id ?? '',
                menu_item_id: mod.menu_item_id,
                name: mod.name,
                min_sel: mod.min_sel ?? 0,
                max_sel: mod.max_sel ?? 1,
                is_required: mod.is_required ?? false,
                modifier_options: []  // Initialize with empty options
            })));
        }
    }, [item, form]);
    
    const onSubmit = async (data: FormData) => {
        // Validate required selections
        const invalidModifier = data.modifier_groups.find(mod => 
            mod.is_required && mod.modifier_options.length !== mod.max_sel
        );

        if (invalidModifier) {
            console.error(`Please select exactly ${invalidModifier.max_sel} options for ${invalidModifier.name}`);
            return;
        }

        const cartModifiers: CartItemModifier[] = data.modifier_groups.map(formMod => {
            const modifier = item?.modifier_groups?.find(m => m.id === formMod.id);
            if (!modifier) return [];
            return {
                id: modifier.id,
                modifier_id: modifier.id,
                modifier_option_name: modifier.name,
                cart_item_modifier_options: formMod.modifier_options.map(opt => ({
                    modifier_option_id: opt.id,
                    name: opt.name,
                    modifier_option_price: opt.price
                }))
            }
        }).filter(Boolean) as CartItemModifier[];

        const cartItem = {
            menu_items: {
                id: item?.id || '',
                name: item?.name || '',
                image_urls: item?.image_urls || [],
                base_price: item?.base_price || 0
            },
            base_price: item?.base_price || 0,
            total_price: (item?.base_price || 0) * data.quantity,
            quantity: data.quantity,
            special_instructions: data.special_instructions,
            cart_item_modifiers: cartModifiers
        };
        
        try {  
            await handleCartUpdate(cartItem);
            showToast('Item added to cart', 'success');
            form.reset();
            if (item?.modifier_groups) {
                form.setValue('modifier_groups', item.modifier_groups.map((mod: ModifierGroup) => ({
                    ...mod,
                    min_sel: mod.min_sel || 1,
                    max_sel: mod.max_sel || 1,
                    is_required: mod.is_required || true,
                    modifier_options: [] as {
                        id: string;
                        name: string;
                        modifier_group_id: number;
                        price: number;
                    }[]
                })));
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            showToast('Error adding item to cart', 'error');
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

    
    return (
        <div className="grid gap-12 mb-20" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Left Gallery */}
            <div className="sticky top-24 self-start">
                <div id="main-image" className="aspect-square rounded-2xl overflow-hidden mb-3 flex items-center justify-center" style={{ background:"repeating-linear-gradient(45deg,#222 0,#222 1px,#1a1a1a 1px,#1a1a1a 14px)"}}>
                    <Image
                        src={`${item.image_urls?.[selectedImage]}`}
                        alt={item.name}
                        fill
                        className="object-contain object-center"    
                        onLoad={handleImageLoad}
                        priority            
                    />
                    <span className="font-mono text-xs text-[#444]" id="main-image-label">dragon-roll-1.jpg</span>
                </div>
                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-2.5">
                    <button className="gallery-thumb active aspect-square rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center" style={{ background:"repeating-linear-gradient(45deg,#222 0,#222 1px,#1a1a1a 1px,#1a1a1a 14px)" }}>
                        <span className ="font-mono text-[9px] text-[#444]">01</span>
                    </button>
                    <button className="gallery-thumb aspect-square rounded-lg overflow-hidden border-2 border-transparent transition-all flex items-center justify-center" style={{ background:"repeating-linear-gradient(135deg,#222 0,#222 1px,#1a1a1a 1px,#1a1a1a 14px)" }}>
                        <span className="font-mono text-[9px] text-[#444]">02</span>
                    </button>
                    <button className="gallery-thumb aspect-square rounded-lg overflow-hidden border-2 border-transparent transition-all flex items-center justify-center" style={{ background:"repeating-linear-gradient(45deg,#1f1f1f 0,#1f1f1f 1px,#181818 1px,#181818 14px)" }}>
                        <span className="font-mono text-[9px] text-[#444]">03</span>
                    </button>
                    <button className="gallery-thumb aspect-square rounded-lg overflow-hidden border-2 border-transparent transition-all flex items-center justify-center" style={{ background:"repeating-linear-gradient(135deg,#1f1f1f 0,#1f1f1f 1px,#181818 1px,#181818 14px)" }}>
                        <span className="font-mono text-[9px] text-[#444]">04</span>
                    </button>
                </div>
            </div>
            {/* Right Details */}
            <div>
                {/* Item Header */}
                <div className="mb-8 pb-8 border-b border-[#242424]">
                    {/* <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[10px] font-medium bg-accent/15 text-accent border border-accent/30 rounded-full px-2.5 py-1 uppercase tracking-wider">Rolls</span>
                        <span className="text-[10px] font-medium bg-white/5 text-white/60 border border-white/10 rounded-full px-2.5 py-1">Contains shellfish</span>
                    </div> */}
                    <h1 className="font-serif font-normal text-white tracking-tight mb-3" style={{ fontSize: 'clamp(36px,4.5vw,52px)', lineHeight: 1.1 }}>{item?.name}</h1>
                    <p className="text-base text-white/60 leading-relaxed mb-4 max-w-[480px]">{item?.description}</p>
                    <p className="font-serif text-[32px] text-white" id="base-price-display">${item?.base_price?.toFixed(2)}</p>
                </div>
                {/* Item Form */}
                <Form {...form}>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            const data = form.getValues();
                            onSubmit(data);
                        }} 
                        className="space-y-8"
                    >
                        
                        {item?.modifier_groups?.map((modifier, index) => (
                            <div 
                                key={modifier?.id} 
                                className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-lg font-medium">{modifier?.name}</FormLabel>
                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                        modifier?.is_required 
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                        }`}
                                    >
                                        {modifier?.is_required ? 'Required' : 'Optional'}
                                    </span>
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`modifier_groups.${index}.modifier_options`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                            {modifier.max_sel === 1 ? (
                                                <RadioGroup
                                                    value={field.value?.[0]?.id?.toString() || ''}
                                                    onValueChange={(value) => {
                                                        const selectedOption = modifier?.modifier_options?.find(opt => opt.id.toString() === value);
                                                        if (selectedOption) {
                                                            handleModifierChange(modifier.id, selectedOption, true);
                                                        }
                                                    }}
                                                    className="space-y-3"
                                                >
                                                    {modifier?.modifier_options?.map((option) => (
                                                        <div 
                                                            key={option.id} 
                                                            className="flex items-center space-x-3 bg-black/20 rounded-lg p-3 hover:bg-black/30 transition-colors"
                                                        >
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
                                                    const atMaxSelections = (field.value || []).length >= (modifier?.max_sel || 1);
                                                    const isDisabled = !isSelected && atMaxSelections;
                                                    return (
                                                        <div 
                                                            key={option.id} 
                                                            className={`flex items-center space-x-3 bg-black/20 rounded-lg p-3 transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/30'}`}
                                                        >
                                                            <Checkbox
                                                                id={`${modifier.id}-${option.id}`}
                                                                checked={isSelected}
                                                                disabled={isDisabled}
                                                                onCheckedChange={(checked) => {
                                                                    handleModifierChange(modifier.id, option, checked as boolean);
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
                        <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
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

                                        <AddToCartButton 
                                            type="submit" 
                                            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                                            isLoading={loading}
                                        >
                                            Add to Cart
                                        </AddToCartButton>
                                    </form>
                                </Form>
            </div>
        </div>
    )
}