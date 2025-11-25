<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Global Low Stock Threshold
    |--------------------------------------------------------------------------
    |
    | This value defines the default low stock threshold for all products.
    | When a product's stock quantity falls below this threshold, a low stock
    | notification will be sent to admins. Individual products can override
    | this value by setting their own low_stock_threshold.
    |
    */

    'low_stock_threshold' => env('LOW_STOCK_THRESHOLD', 5),

];
