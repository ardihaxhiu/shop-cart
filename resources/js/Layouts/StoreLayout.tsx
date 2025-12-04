import { Link, router, usePage } from '@inertiajs/react';
import { Heart, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { type ReactNode, useState, FormEvent, useEffect } from 'react';
import { Button } from '@/Components/Ui/Button';
import { Input } from '@/Components/Ui/Input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/Ui/DropdownMenu';
import { logout } from '@/routes';
import { type User as UserType } from '@/types';
import axios from 'axios';
import { useToastFlash } from '@/hooks/useToastFlash';

interface StoreLayoutProps {
    children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
    useToastFlash();
    const { auth } = usePage<{ auth: { user: UserType } }>().props;
    const [search, setSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/', { search }, { preserveState: true });
    };

    const fetchCartCount = async () => {
        try {
            const response = await axios.get('/cart/count');
            setCartCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
        }
    };

    useEffect(() => {
        fetchCartCount();

        // Listen for cart updates
        const handleCartUpdate = () => {
            fetchCartCount();
        };

        window.addEventListener('cart-updated', handleCartUpdate);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <header className="sticky top-0 z-50 bg-[#1a1a1a] text-white">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="text-2xl font-bold">
                                <span className="text-white">shop</span>
                                <span className="text-orange-500">cart</span>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="flex max-w-2xl flex-1 items-center"
                        >
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full rounded-full border-0 bg-white pr-12 text-gray-900 placeholder:text-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 flex h-10 w-12 items-center justify-center rounded-r-full bg-white text-gray-600 hover:text-gray-900"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </form>

                        {/* Right Icons */}
                        <div className="flex items-center gap-4">
                            <Link href="/cart">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative text-white hover:bg-white/10 hover:text-white"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/10 hover:text-white"
                                        >
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            {auth.user.name}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={logout.post()}
                                                method="post"
                                                as="button"
                                                className="w-full"
                                            >
                                                Logout
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:bg-white/10 hover:text-white"
                                    >
                                        Login
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto min-h-screen px-4 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-white py-8">
                <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                    © 2025 ShopCart. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

