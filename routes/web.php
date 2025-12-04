<?php

use Illuminate\Support\Facades\Route;

// Public shop page (customer-facing)
Route::get('/', [\App\Http\Controllers\ProductController::class, 'shop'])->name('home');
Route::get('product/{product}', [\App\Http\Controllers\ProductController::class, 'show'])->name('product.show');

// Cart routes (available to guests and authenticated users)
Route::get('cart', [\App\Http\Controllers\CartController::class, 'index'])->name('cart.index');
Route::post('cart/add', [\App\Http\Controllers\CartController::class, 'add'])->name('cart.add');
Route::put('cart/{cartItem}', [\App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
Route::delete('cart/{cartItem}', [\App\Http\Controllers\CartController::class, 'remove'])->name('cart.remove');
Route::get('cart/count', [\App\Http\Controllers\CartController::class, 'count'])->name('cart.count');
Route::post('cart/checkout', [\App\Http\Controllers\CartController::class, 'checkout'])->name('cart.checkout');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Admin dashboard
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Admin product management
    Route::get('products', [\App\Http\Controllers\ProductController::class, 'index'])->name('products');
    Route::get('products/create', [\App\Http\Controllers\ProductController::class, 'create'])->name('products.create');
    Route::post('products', [\App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}/edit', [\App\Http\Controllers\ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [\App\Http\Controllers\ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [\App\Http\Controllers\ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('products/{product}/restore', [\App\Http\Controllers\ProductController::class, 'restore'])->name('products.restore');
});

require __DIR__.'/settings.php';
