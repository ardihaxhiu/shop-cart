import { Button } from '@/Components/Ui/Button';
import StoreLayout from '@/Layouts/StoreLayout';
import { type Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Heart, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';

interface ProductDetailProps {
    product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const handleAddToCart = () => {
        // TODO: Implement cart functionality
        console.log('Add to cart:', product, quantity);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity(quantity + 1);
        }
    };

    // Simulate multiple images (in real app, product would have multiple images)
    const images = [product.image, product.image, product.image];

    return (
        <StoreLayout>
            <Head title={product.name} />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-gray-900">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/" className="hover:text-gray-900">
                        Products
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                {/* Product Detail Container */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left Side - Image Gallery */}
                    <div className="space-y-4">
                        {/* Stock Badge */}
                        {product.stock_quantity > 0 && (
                            <div className="inline-flex items-center gap-2 rounded bg-orange-500 px-3 py-1.5 text-sm font-medium text-white">
                                <span>In Stock</span>
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <img
                                src={images[selectedImage] || product.image}
                                alt={product.name}
                                className="h-full w-full object-contain p-8"
                            />
                            <div className="absolute right-4 top-4 text-sm text-gray-500">
                                {selectedImage + 1} / {images.length}
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-6 gap-2">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square overflow-hidden rounded-lg border-2 bg-white p-2 transition-all ${selectedImage === index
                                        ? 'border-orange-500'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="h-full w-full object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="space-y-6">
                        {/* Product Title & Code */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {product.name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Code: PROD-{product.id}
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className="space-y-2 border-b border-gray-200 pb-6">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                                {/* You could add original price here if you have discount */}
                            </div>

                            {/* Payment Options */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="rounded bg-orange-100 px-2 py-1 font-medium text-orange-600">
                                        PayPlan
                                    </span>
                                    <span>
                                        Pay in installments -{' '}
                                        <strong>
                                            $
                                            {(Number(product.price) / 24).toFixed(2)}/mo
                                        </strong>{' '}
                                        for 24 months
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="space-y-3 border-b border-gray-200 pb-6">
                            <h3 className="font-semibold text-gray-900">
                                Specifications
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Stock Quantity:</span>
                                    <span className="font-medium text-gray-900">
                                        {product.stock_quantity} units
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Product ID:</span>
                                    <span className="font-medium text-gray-900">
                                        {product.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Availability:</span>
                                    <span
                                        className={`font-medium ${product.stock_quantity > 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}
                                    >
                                        {product.stock_quantity > 0
                                            ? 'In Stock'
                                            : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center rounded-lg border border-gray-300">
                                        <button
                                            onClick={decrementQuantity}
                                            className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="h-10 w-16 border-x border-gray-300 text-center"
                                        />
                                        <button
                                            onClick={incrementQuantity}
                                            className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100"
                                            disabled={quantity >= product.stock_quantity}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity === 0}
                                    className="flex-1 bg-orange-500 py-6 text-base font-semibold hover:bg-orange-600"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    BUY NOW
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-auto border-2 px-4 py-6"
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-orange-100 p-2">
                                    <Truck className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-gray-900">
                                        Free Shipping
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Delivery in 3-5 business days
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                            <h4 className="font-semibold text-gray-900">
                                Payment Methods
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded border border-gray-200 p-2 text-center text-sm">
                                    💳 Card
                                </div>
                                <div className="rounded border border-gray-200 p-2 text-center text-sm">
                                    💰 Cash
                                </div>
                                <div className="rounded border border-gray-200 p-2 text-center text-sm">
                                    🏦 Bank
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Tabs */}
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8 px-6">
                            <button className="border-b-2 border-orange-500 py-4 text-sm font-medium text-gray-900">
                                Description
                            </button>
                            <button className="py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                                Specifications
                            </button>
                            <button className="py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                                Reviews
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600">
                                {product.name} - High quality product with excellent
                                features and performance. Perfect for your needs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}

