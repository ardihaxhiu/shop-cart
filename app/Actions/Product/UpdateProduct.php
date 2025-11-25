<?php

namespace App\Actions\Product;

use App\Models\Product;
use Illuminate\Http\UploadedFile;

class UpdateProduct
{
    public function handle(Product $product, array $data, ?UploadedFile $image = null): Product
    {
        if ($image) {
            $imagePath = $image->store('products', 'public');
            $data['image'] = '/storage/'.$imagePath;
        } else {
            // Don't update image if no new file was uploaded
            unset($data['image']);
        }

        $product->update($data);

        return $product;
    }
}
