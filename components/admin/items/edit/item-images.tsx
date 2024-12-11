import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { Product } from "@/types/definitions"

interface ItemImagesProps {
    item: Product
}

export function ItemImages({ item }: ItemImagesProps) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Item Images</CardTitle>
            </CardHeader>
            <CardContent>
                {item.image_urls && item.image_urls.length > 0 ? (
                    <>
                        {/* Main Image */}
                        <div className="mb-4">
                            <img
                                alt={`${item.name} main image`}
                                className="aspect-square w-full rounded-md object-cover"
                                height="300"
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${item.image_urls[0]}`}
                                width="300"
                            />
                        </div>

                        {/* Thumbnails and Upload */}
                        <div className="grid grid-cols-3 gap-2">
                            {item.image_urls.map((image, index) => (
                                <button 
                                    key={index} 
                                    type="button"
                                    className="relative group"
                                >
                                    <img
                                        alt={`${item.name} thumbnail ${index + 1}`}
                                        className="aspect-square w-full rounded-md object-cover"
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-items/${image}`}
                                    />
                                    <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm transition-opacity">
                                        Set as main
                                    </div>
                                </button>
                            ))}
                            {item.image_urls.length < 3 && (
                                <button 
                                    type="button"
                                    className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed hover:bg-gray-50 transition-colors"
                                >
                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">Upload new image</span>
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                        <button 
                            type="button"
                            className="flex aspect-square w-32 items-center justify-center rounded-md border border-dashed hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="sr-only">Upload new image</span>
                        </button>
                        <p className="text-sm text-muted-foreground mt-2">No images uploaded</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
