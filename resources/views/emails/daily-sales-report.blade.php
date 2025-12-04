<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .container {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
        }

        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 16px;
        }

        .content {
            padding: 30px;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 8px;
            color: white;
            text-align: center;
        }

        .summary-card h3 {
            margin: 0 0 10px;
            font-size: 14px;
            text-transform: uppercase;
            opacity: 0.9;
            font-weight: normal;
        }

        .summary-card .value {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table th {
            background-color: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
        }

        table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }

        table tr:hover {
            background-color: #f8f9fa;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }

        .empty-state svg {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
            border-top: 1px solid #dee2e6;
        }

        @media only screen and (max-width: 600px) {
            .summary-cards {
                grid-template-columns: 1fr;
            }

            table {
                font-size: 14px;
            }

            table th,
            table td {
                padding: 8px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>📊 Daily Sales Report</h1>
            <p>{{ $reportData['date'] }}</p>
        </div>

        <div class="content">
            <!-- Summary Cards -->
            <div class="summary-cards">
                <div class="summary-card">
                    <h3>Total Orders</h3>
                    <p class="value">{{ $reportData['totalOrders'] }}</p>
                </div>
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <p class="value">${{ number_format($reportData['totalRevenue'], 2) }}</p>
                </div>
                <div class="summary-card">
                    <h3>Items Sold</h3>
                    <p class="value">{{ $reportData['totalItemsSold'] }}</p>
                </div>
            </div>

            @if ($reportData['totalOrders'] > 0)
                <!-- Product Sales Breakdown -->
                <div class="section">
                    <h2>Top Selling Products</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th class="text-center">Quantity Sold</th>
                                <th class="text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($reportData['productSales'] as $product)
                                <tr>
                                    <td>{{ $product['name'] }}</td>
                                    <td class="text-center">{{ $product['quantity'] }}</td>
                                    <td class="text-right">${{ number_format($product['revenue'], 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <!-- Recent Orders -->
                <div class="section">
                    <h2>Recent Orders</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Time</th>
                                <th class="text-center">Items</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($reportData['orders'] as $order)
                                <tr>
                                    <td>#{{ $order->id }}</td>
                                    <td>{{ $order->created_at->format('h:i A') }}</td>
                                    <td class="text-center">{{ $order->total_items }}</td>
                                    <td class="text-right">${{ number_format($order->total_amount, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3>No Sales Yesterday</h3>
                    <p>There were no orders placed on {{ $reportData['date'] }}</p>
                </div>
            @endif
        </div>

        <div class="footer">
            <p>This is an automated daily sales report. You're receiving this because you're an admin.</p>
            <p style="margin-top: 10px;">
                <strong>Shopping Cart System</strong> | Generated at {{ now()->format('Y-m-d H:i:s') }}
            </p>
        </div>
    </div>
</body>

</html>
