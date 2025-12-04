import { Button } from '@/Components/Ui/Button';
import { Input } from '@/Components/Ui/Input';
import { Label } from '@/Components/Ui/Label';
import AppLayout from '@/Layouts/AppLayout';
import { products as productsRoute } from '@/routes';
import productsRoutes from '@/routes/products';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    low_stock_threshold: number | null;
    image: string;
}

interface EditProductProps {
    product: Product;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: productsRoute().url,
    },
    {
        title: 'Edit Product',
        href: '#',
    },
];

export default function EditProduct({ product }: EditProductProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        low_stock_threshold: product.low_stock_threshold?.toString() || '',
        image: null as File | null,
        _method: 'PUT',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        product.image
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/products/${product.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-6 rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Edit Product
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Update product details
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Product Name
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Enter product name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Price
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                    placeholder="0.00"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-sm text-destructive">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock_quantity">
                                    Stock Quantity
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="stock_quantity"
                                    type="number"
                                    min="0"
                                    value={data.stock_quantity}
                                    onChange={(e) =>
                                        setData('stock_quantity', e.target.value)
                                    }
                                    placeholder="0"
                                    required
                                />
                                {errors.stock_quantity && (
                                    <p className="text-sm text-destructive">
                                        {errors.stock_quantity}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="low_stock_threshold">
                                    Low Stock Threshold
                                </Label>
                                <Input
                                    id="low_stock_threshold"
                                    type="number"
                                    min="0"
                                    value={data.low_stock_threshold}
                                    onChange={(e) =>
                                        setData('low_stock_threshold', e.target.value)
                                    }
                                    placeholder="Leave empty for default (5)"
                                />
                                {errors.low_stock_threshold && (
                                    <p className="text-sm text-destructive">
                                        {errors.low_stock_threshold}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Optional. If not set, the global threshold (5) will be used.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">
                                    Product Image
                                    <span className="text-muted-foreground ml-1">
                                        (optional)
                                    </span>
                                </Label>
                                <Input
                                    id="image"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {errors.image && (
                                    <p className="text-sm text-destructive">
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </div>

                        {imagePreview && (
                            <div className="space-y-2">
                                <Label>Image Preview</Label>
                                <div className="relative h-48 w-48 overflow-hidden rounded-lg border">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Product'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    (window.location.href = productsRoute().url)
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

