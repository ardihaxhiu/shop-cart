<?php

namespace App\Http\Controllers;

use App\Actions\Cart\AddToCart;
use App\Actions\Cart\GetCartCount;
use App\Actions\Cart\GetCartItems;
use App\Actions\Cart\ProcessCheckout;
use App\Actions\Cart\RemoveFromCart;
use App\Actions\Cart\UpdateCartItem;
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function __construct(
        private GetCartItems $getCartItems,
        private AddToCart $addToCart,
        private UpdateCartItem $updateCartItem,
        private RemoveFromCart $removeFromCart,
        private GetCartCount $getCartCount,
        private ProcessCheckout $processCheckout
    ) {}

    public function index(Request $request)
    {
        $cartItems = $this->getCartItems->handle($request);

        return Inertia::render('Shop/Cart/Index', [
            'cartItems' => $cartItems['items'],
            'subtotal' => $cartItems['subtotal'],
        ]);
    }

    public function add(AddToCartRequest $request)
    {
        $validated = $request->validated();

        $result = $this->addToCart->handle(
            $request,
            $validated['product_id'],
            $validated['quantity']
        );

        $type = $result['success'] ? 'success' : 'error';

        return back()->with($type, $result['message']);
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem)
    {
        $validated = $request->validated();

        $result = $this->updateCartItem->handle($cartItem, $validated['quantity']);

        $type = $result['success'] ? 'success' : 'error';

        return back()->with($type, $result['message']);
    }

    public function remove(CartItem $cartItem)
    {
        $message = $this->removeFromCart->handle($cartItem);

        return back()->with('success', $message);
    }

    public function count(Request $request)
    {
        $count = $this->getCartCount->handle($request);

        return response()->json(['count' => $count]);
    }

    public function checkout()
    {
        try {
            $result = $this->processCheckout->handle();

            return redirect()->route('home')->with('success', $result['message']);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
