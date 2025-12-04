<?php

namespace App\Actions\Cart;

use Illuminate\Http\Request;

class GetCartCount
{
    public function __construct(
        private GetCartItems $getCartItems
    ) {}

    public function handle(Request $request): int
    {
        return $this->getCartItems->handle($request)['items']->sum('quantity');
    }
}
