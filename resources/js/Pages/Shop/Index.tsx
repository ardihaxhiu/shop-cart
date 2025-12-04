import { Button } from '@/Components/Ui/Button';
import StoreLayout from '@/Layouts/StoreLayout';
import { type Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Heart, ShoppingCart } from 'lucide-react';

interface ShopPageProps {
    products: {
        data: Product[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search: string;
        sort: string;
    };
}

export default function Shop({ products, filters }: ShopPageProps) {
    const handleAddToCart = (product: Product) => {
        router.post(
            '/cart/add',
            {
                product_id: product.id,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    window.dispatchEvent(new Event('cart-updated'));
                },
            },
        );
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/',
            {
                search: filters.search,
                sort: e.target.value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <StoreLayout>
            <Head title="Shop" />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="hover:text-gray-900">Home</span>
                    <span>/</span>
                    <span className="text-gray-900">All Products</span>
                </div>

                {/* Products Count & Sort */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {products.total} products found
                    </p>
                    <select
                        value={filters.sort}
                        onChange={handleSortChange}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                    </select>
                </div>

                {/* Products Grid */}
                {products.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-white py-16 text-center">
                        <p className="text-lg text-gray-600">
                            {filters.search
                                ? 'No products found matching your search.'
                                : 'No products available at the moment.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {products.data.map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                                >
                                    {/* Product Image */}
                                    <Link
                                        href={`/product/${product.id}`}
                                        className="relative block aspect-[5/4] overflow-hidden bg-gray-100"
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                No image
                                            </div>
                                        )}

                                        {/* Stock Badge */}
                                        {product.stock_quantity === 0 && (
                                            <div className="absolute left-3 top-3 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                                Out of Stock
                                            </div>
                                        )}
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <Link
                                            href={`/product/${product.id}`}
                                            className="block"
                                        >
                                            <h3 className="line-clamp-2 min-h-[3rem] text-sm font-medium text-gray-900 hover:text-orange-600">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="text-lg font-bold text-gray-900">
                                                ${Number(product.price).toFixed(2)}
                                            </div>
                                            <Button
                                                size="sm"
                                                disabled={product.stock_quantity === 0}
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-orange-500 hover:bg-orange-600"
                                            >
                                                <ShoppingCart className="mr-1 h-4 w-4" />
                                                Add
                                            </Button>
                                        </div>

                                        {product.stock_quantity > 0 &&
                                            product.stock_quantity <= 5 && (
                                                <p className="mt-2 text-xs text-orange-600">
                                                    Only {product.stock_quantity} left in
                                                    stock
                                                </p>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {products.links.map((link, index) => {
                                    const isNumber = !isNaN(Number(link.label));
                                    const isPrev = link.label.includes('Previous');
                                    const isNext = link.label.includes('Next');

                                    return (
                                        <button
                                            key={index}
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url);
                                                }
                                            }}
                                            className={`min-w-[40px] rounded px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${link.active
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                                } ${!isNumber && 'border border-gray-300'}`}
                                        >
                                            {isPrev
                                                ? '←'
                                                : isNext
                                                    ? '→'
                                                    : link.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </StoreLayout>
    );
}
