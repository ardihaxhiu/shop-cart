<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'stock_quantity',
        'low_stock_threshold',
        'image',
    ];

    /**
     * Get the low stock threshold for this product.
     * Falls back to global config if not set.
     */
    public function getLowStockThresholdValue(): int
    {
        return $this->low_stock_threshold ?? config('inventory.low_stock_threshold', 5);
    }

    /**
     * Check if product is low on stock
     */
    public function isLowStock(): bool
    {
        return $this->stock_quantity < $this->getLowStockThresholdValue();
    }
}
