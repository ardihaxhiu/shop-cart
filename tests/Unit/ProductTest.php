<?php

use App\Models\Product;

test('product uses global threshold when not set', function () {
    config(['inventory.low_stock_threshold' => 10]);

    $product = new Product([
        'name' => 'Test',
        'price' => 10,
        'low_stock_threshold' => null,
        'stock_quantity' => 5,
        'image' => 'test.jpg',
    ]);

    expect($product->getLowStockThresholdValue())->toBe(10);
});

test('product uses its own threshold when set', function () {
    config(['inventory.low_stock_threshold' => 10]);

    $product = new Product([
        'name' => 'Test',
        'price' => 10,
        'low_stock_threshold' => 3,
        'stock_quantity' => 5,
        'image' => 'test.jpg',
    ]);

    expect($product->getLowStockThresholdValue())->toBe(3);
});

test('product is low stock when below threshold', function () {
    $product = new Product([
        'name' => 'Test',
        'price' => 10,
        'low_stock_threshold' => 5,
        'stock_quantity' => 3,
        'image' => 'test.jpg',
    ]);

    expect($product->isLowStock())->toBeTrue();
});

test('product is not low stock when at or above threshold', function () {
    $product = new Product([
        'name' => 'Test',
        'price' => 10,
        'low_stock_threshold' => 5,
        'stock_quantity' => 5,
        'image' => 'test.jpg',
    ]);

    expect($product->isLowStock())->toBeFalse();

    $product->stock_quantity = 10;
    expect($product->isLowStock())->toBeFalse();
});
