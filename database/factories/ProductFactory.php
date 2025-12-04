<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'price' => fake()->randomFloat(2, 10, 500),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'low_stock_threshold' => fake()->optional()->numberBetween(1, 10),
            'image' => fake()->imageUrl(400, 300, 'products'),
        ];
    }

    /**
     * Out of stock product
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Low stock product
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 2,
            'low_stock_threshold' => 5,
        ]);
    }
}

