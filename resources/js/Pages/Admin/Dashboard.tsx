import AppLayout from '@/Layouts/AppLayout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    DollarSign,
    Package,
    ShoppingBag,
    TrendingUp,
    Users,
} from 'lucide-react';

interface DashboardProps {
    stats: {
        totalRevenue: number;
        todayRevenue: number;
        revenueChange: number;
        totalOrders: number;
        todayOrders: number;
        ordersChange: number;
        totalProducts: number;
        lowStockProducts: number;
        totalCustomers: number;
    };
    recentOrders: Array<{
        id: number;
        total_amount: number;
        total_items: number;
        created_at: string;
    }>;
    topProducts: Array<{
        id: number;
        name: string;
        image: string;
        total_sold: number;
        total_revenue: number;
    }>;
    salesChartData: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    stats,
    recentOrders,
    topProducts,
    salesChartData,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Revenue Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Revenue
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        ${Number(stats.totalRevenue).toFixed(2)}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            {stats.revenueChange >= 0 ? (
                                <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                            <span
                                className={
                                    stats.revenueChange >= 0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }
                            >
                                {Math.abs(stats.revenueChange)}%
                            </span>
                            <span className="text-muted-foreground">
                                vs yesterday
                            </span>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                    <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Orders
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        {stats.totalOrders}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            {stats.ordersChange >= 0 ? (
                                <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                            <span
                                className={
                                    stats.ordersChange >= 0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }
                            >
                                {Math.abs(stats.ordersChange)}%
                            </span>
                            <span className="text-muted-foreground">
                                vs yesterday
                            </span>
                        </div>
                    </div>

                    {/* Products Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                    <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Products
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        {stats.totalProducts}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm">
                            <span className="text-orange-600">
                                {stats.lowStockProducts}
                            </span>
                            <span className="text-muted-foreground">
                                {' '}
                                low stock items
                            </span>
                        </div>
                    </div>

                    {/* Customers Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Customers
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        {stats.totalCustomers}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Active users
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Recent Orders
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                <ShoppingBag className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    Order #{order.id}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.total_items} items
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                $
                                                {Number(
                                                    order.total_amount,
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    No orders yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Top Selling Products
                            </h3>
                            <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-4">
                            {topProducts.length > 0 ? (
                                topProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Package className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.total_sold} sold
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">
                                                $
                                                {Number(
                                                    product.total_revenue,
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    No sales data yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sales Chart */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-semibold">
                        Sales Overview (Last 7 Days)
                    </h3>
                    {salesChartData.length > 0 ? (
                        <div className="space-y-4">
                            {salesChartData.map((day) => {
                                const maxRevenue = Math.max(
                                    ...salesChartData.map((d) => d.revenue),
                                );
                                const percentage =
                                    (day.revenue / maxRevenue) * 100;

                                return (
                                    <div key={day.date} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">
                                                {new Date(
                                                    day.date,
                                                ).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <div className="flex gap-4">
                                                <span className="text-muted-foreground">
                                                    {day.orders} orders
                                                </span>
                                                <span className="font-semibold text-green-600">
                                                    $
                                                    {Number(day.revenue).toFixed(
                                                        2,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            No sales data available
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
