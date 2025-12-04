import { DeleteConfirmDialog } from '@/Components/DeleteConfirmDialog';
import { Badge } from '@/Components/Ui/Badge';
import { Button } from '@/Components/Ui/Button';
import { Input } from '@/Components/Ui/Input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/Ui/Table';
import AppLayout from '@/Layouts/AppLayout';
import { products as productsRoute } from '@/routes';
import productsRoutes from '@/routes/products';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, RotateCcw, Search, Trash } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface ProductsPageProps {
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: productsRoute().url,
    },
];

export default function Products({ products, filters }: ProductsPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            productsRoute().url,
            { search, sort: filters.sort },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            productsRoute().url,
            { search: filters.search, sort: e.target.value },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        router.get(productsRoute().url, {}, { preserveState: true });
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (productToDelete) {
            router.delete(productsRoutes.destroy(productToDelete.id).url, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    toast.success('Product deleted', {});
                    setProductToDelete(null);
                },
            });
        }
    };

    const handleRestore = (product: Product) => {
        router.post(`/products/${product.id}/restore`, {}, {
            onSuccess: () => {
                toast.success('Product restored');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Products</h2>
                            <p className="text-sm text-muted-foreground">
                                Manage your product inventory
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={productsRoutes.create()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Product
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-1 items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search products by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                            {filters.search && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                >
                                    Clear
                                </Button>
                            )}
                        </form>

                        <select
                            value={filters.sort}
                            onChange={handleSortChange}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name: A to Z</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="stock_low">Stock: Low to High</option>
                            <option value="stock_high">Stock: High to Low</option>
                        </select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Low Stock Threshold</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="h-24 text-center"
                                        >
                                            {filters.search
                                                ? 'No products found matching your search.'
                                                : 'No products available.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.data.map((product) => (
                                        <TableRow 
                                            key={product.id}
                                            className={product.deleted_at ? 'opacity-60' : ''}
                                        >
                                            <TableCell className="font-medium">
                                                {product.id}
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>
                                                ${Number(product.price).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {product.stock_quantity}
                                            </TableCell>
                                            <TableCell>
                                                {product.low_stock_threshold ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        No image
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product.deleted_at ? (
                                                    <Badge variant="destructive">Drafted</Badge>
                                                ) : (
                                                    <Badge variant="success">Published</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    product.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={productsRoutes.edit(product.id).url}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {!product.deleted_at ? (
                                                    <Button 
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(product)}
                                                    >
                                                        <Trash className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Restore Product"
                                                        onClick={() => handleRestore(product)}
                                                    >
                                                        <RotateCcw className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {products.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {products.data.length} of {products.total}{' '}
                                products
                            </p>
                            <div className="flex gap-2">
                                {products.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) {
                                                router.get(link.url);
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                description="This action cannot be undone and will permanently remove the product from your inventory."
                itemName={productToDelete?.name}
            />
        </AppLayout>
    );
}

