import { Button } from '@/Components/Ui/Button';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
        stock_quantity: number;
    };
}

interface CartPageProps {
    cartItems: CartItem[];
    subtotal: number;
}

export default function Cart({ cartItems, subtotal }: CartPageProps) {
    const updateQuantity = (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        router.put(
            `/cart/${cartItemId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    window.dispatchEvent(new Event('cart-updated'));
                },
            },
        );
    };

    const removeItem = (cartItemId: number) => {
        router.delete(`/cart/${cartItemId}`, {
            preserveScroll: true,
            onSuccess: () => {
                window.dispatchEvent(new Event('cart-updated'));
            },
        });
    };

    const handleCheckout = () => {
        router.post('/cart/checkout', {}, {
            onSuccess: () => {
                window.dispatchEvent(new Event('cart-updated'));
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0] as string;
                toast.error(errorMessage || 'Failed to complete purchase');
            },
        });
    };

    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <StoreLayout>
            <Head title="Shopping Cart" />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-gray-900">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">Shopping Cart</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
                        <div className="mx-auto max-w-md space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600">
                                Add some products to your cart to see them here.
                            </p>
                            <Button asChild className="bg-orange-500 hover:bg-orange-600">
                                <Link href="/">Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="space-y-4 lg:col-span-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Shopping Cart ({cartItems.length} items)
                            </h1>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4"
                                    >
                                        {/* Product Image */}
                                        <Link
                                            href={`/product/${item.product.id}`}
                                            className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="space-y-2">
                                                <Link
                                                    href={`/product/${item.product.id}`}
                                                    className="text-lg font-medium text-gray-900 hover:text-orange-600"
                                                >
                                                    {item.product.name}
                                                </Link>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-xl font-bold text-gray-900">
                                                        $
                                                        {Number(
                                                            item.product.price,
                                                        ).toFixed(2)}
                                                    </span>

                                                    {item.product.stock_quantity <=
                                                        5 && (
                                                            <span className="text-sm text-orange-600">
                                                                Only{' '}
                                                                {item.product.stock_quantity}{' '}
                                                                left
                                                            </span>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center rounded-lg border border-gray-300">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity - 1,
                                                            )
                                                        }
                                                        className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                        className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100"
                                                        disabled={
                                                            item.quantity >=
                                                            item.product.stock_quantity
                                                        }
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="flex flex-col items-end justify-between">
                                            <div className="text-xl font-bold text-gray-900">
                                                $
                                                {(
                                                    Number(item.product.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-4 rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Order Summary
                                </h2>

                                <div className="space-y-2 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between border-t border-gray-200 pt-4 text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-orange-500 py-6 text-lg font-semibold hover:bg-orange-600"
                                >
                                    Buy Now
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link href="/">Continue Shopping</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}

