<?php

namespace App\Http\Controllers;

use App\Actions\Product\CreateProduct;
use App\Actions\Product\GetFilteredProducts;
use App\Actions\Product\UpdateProduct;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        private GetFilteredProducts $getFilteredProducts,
        private CreateProduct $createProduct,
        private UpdateProduct $updateProduct
    ) {}

    // Public shop page for customers
    public function shop(Request $request)
    {
        $search = $request->input('search') ?? '';
        $sort = $request->input('sort', 'newest');

        $products = $this->getFilteredProducts->handle(
            search: $search,
            sort: $sort,
            perPage: 12,
            allowedSorts: ['price_low', 'price_high', 'newest', 'name']
        );

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    // Admin product management page
    public function index(Request $request)
    {
        $search = $request->input('search') ?? '';
        $sort = $request->input('sort', 'newest');

        $products = $this->getFilteredProducts->handle(
            search: $search,
            sort: $sort,
            perPage: 10,
            allowedSorts: ['price_low', 'price_high', 'newest', 'oldest', 'name', 'stock_low', 'stock_high'],
            includeDeleted: true
        );

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function show(Product $product)
    {
        return Inertia::render('Shop/Product/Show', [
            'product' => $product,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $this->createProduct->handle(
            data: $request->validated(),
            image: $request->file('image')
        );

        return redirect()->route('products')->with('success', 'Product created successfully!');
    }

    public function edit($product)
    {
        $product = Product::withTrashed()->findOrFail($product);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->updateProduct->handle(
            product: $product,
            data: $request->validated(),
            image: $request->file('image')
        );

        return redirect()->route('products')->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products')->with('success', 'Product deleted successfully!');
    }

    public function restore($product)
    {
        $product = Product::withTrashed()->findOrFail($product);
        $product->restore();

        return redirect()->route('products')->with('success', 'Product restored successfully!');
    }
}
