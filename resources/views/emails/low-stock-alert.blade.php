<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #f97316;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }

        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }

        .alert-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }

        .product-details {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .product-details table {
            width: 100%;
            border-collapse: collapse;
        }

        .product-details td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        .product-details td:first-child {
            font-weight: bold;
            width: 40%;
        }

        .stock-warning {
            color: #dc2626;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            color: #666;
            margin-top: 30px;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>⚠️ Low Stock Alert</h1>
    </div>

    <div class="content">
        <div class="alert-box">
            <strong>Attention Required!</strong><br>
            A product in your inventory is running low on stock.
        </div>

        <div class="stock-warning">
            {{ $product->stock_quantity }} units remaining
        </div>

        <div class="product-details">
            <h2>Product Information</h2>
            <table>
                <tr>
                    <td>Product Name:</td>
                    <td>{{ $product->name }}</td>
                </tr>
                <tr>
                    <td>Current Stock:</td>
                    <td><strong style="color: #dc2626;">{{ $product->stock_quantity }} units</strong></td>
                </tr>
                <tr>
                    <td>Price:</td>
                    <td>${{ number_format($product->price, 2) }}</td>
                </tr>
                <tr>
                    <td>Product ID:</td>
                    <td>#{{ $product->id }}</td>
                </tr>
            </table>
        </div>

        <p style="margin-top: 20px;">
            <strong>Action Required:</strong> Please restock this product to avoid running out of inventory.
        </p>

        <div class="footer">
            <p>This is an automated notification from your Shopping Cart system.</p>
            <p>Sent at {{ now()->format('F j, Y, g:i a') }}</p>
        </div>
    </div>
</body>

</html>
