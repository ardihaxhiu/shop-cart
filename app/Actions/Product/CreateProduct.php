<?php

namespace App\Actions\Product;

use App\Models\Product;
use Illuminate\Http\UploadedFile;

class CreateProduct
{
    public function handle(array $data, ?UploadedFile $image = null): Product
    {
        if ($image) {
            $imagePath = $image->store('products', 'public');
            $data['image'] = '/storage/'.$imagePath;
        }

        return Product::create($data);
    }
}
