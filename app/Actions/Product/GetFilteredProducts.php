<?php

namespace App\Actions\Product;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetFilteredProducts
{
    public function handle(
        string $search = '',
        string $sort = 'newest',
        int $perPage = 12,
        array $allowedSorts = [],
        bool $includeDeleted = false
    ): LengthAwarePaginator {
        $query = Product::query()
            ->when($includeDeleted, function ($query) {
                $query->withTrashed();
            })
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            });

        // Apply sorting based on allowed sorts
        if (empty($allowedSorts) || in_array($sort, $allowedSorts)) {
            $query->when($sort === 'price_low', fn ($q) => $q->orderBy('price', 'asc'))
                ->when($sort === 'price_high', fn ($q) => $q->orderBy('price', 'desc'))
                ->when($sort === 'newest', fn ($q) => $q->orderBy('created_at', 'desc'))
                ->when($sort === 'oldest', fn ($q) => $q->orderBy('created_at', 'asc'))
                ->when($sort === 'name', fn ($q) => $q->orderBy('name', 'asc'))
                ->when($sort === 'stock_low', fn ($q) => $q->orderBy('stock_quantity', 'asc'))
                ->when($sort === 'stock_high', fn ($q) => $q->orderBy('stock_quantity', 'desc'));
        }

        return $query->paginate($perPage)->withQueryString();
    }
}
