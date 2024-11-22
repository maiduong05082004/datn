<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\Statistic;
use App\Models\User;
use App\Models\WishlistItem;
use DB;
use Illuminate\Http\Request;
use Symfony\Component\Console\Input\Input;

class StatisticsController extends Controller
{
    // Thống kê sản phẩm theo lượt bán & sản phẩm bán chạy nhất (top 12)
    public function getTopSellingProducts(Request $request)
    {
        $date = $request->get('date');
        $products = BillDetail::selectRaw('product_id,SUM(quantity) as total_sold')
            ->when($date, function ($query, $date) {
                $query->whereHas('bill', function ($q) use ($date) {
                    $q->whereBetween('created_at', [$date['start'], $date['end']]);
                });
            })
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->take(12)
            ->with('product')
            ->get();
        return response()->json($products);
    }
    // public function productNewHot()
    // {
    //     $productsNewHot = Category::whereNull('parent_id')
    //         ->get()
    //         ->map(function ($category) {
    //             $categoryIds = collect([$category->id]);
    //             $categoryIds = $categoryIds->merge($category->childrenRecursive->pluck('id'));

    //             // Lấy sản phẩm bán chạy
    //             $hotProducts = Product::select('products.*')
    //                 ->join('bill_details', 'products.id', '=', 'bill_details.product_id')
    //                 ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
    //                 ->whereIn('bills.status_bill', ['delivered'])
    //                 ->whereIn('products.category_id', $categoryIds)
    //                 ->groupBy('products.id', 'products.name', 'products.price', 'products.category_id', 'products.stock', 'products.is_hot', 'products.is_new', 'products.is_collection', 'products.created_at', 'products.updated_at')
    //                 ->orderByRaw('SUM(bill_details.quantity) DESC')
    //                 ->take(12)
    //                 ->get();

    //             return [
    //                 'category_id' => $category->id,
    //                 'name' => $category->name,
    //                 'products' => ProductResource::collection($hotProducts), // Chuyển sản phẩm sang resource
    //             ];
    //         });

    //     // Trả về kết quả
    //     return response()->json([
    //         'data' => $productsNewHot,

    //     ]);
    // }

    // Thống kê doanh thu, lợi nhuận
    public function getRevenueAndProfit(Request $request)
    {
        $isSummary = $request->get('summary', false); // Mặc định là false nếu không có tham số truyền vào
        $date = $request->get('date');
        $groupByType = $request->get('group_by', 'day'); // Mặc định là 'day'
        switch ($groupByType) {
            case 'month':
                $groupBy = "CONCAT(YEAR(bills.created_at), '-', LPAD(MONTH(bills.created_at), 2, '0'))";
                break;
            case 'year':
                $groupBy = "YEAR(bills.created_at)";
                break;
            case 'day':
            default:
                $groupBy = "DATE(bills.created_at)";
                break;
        }
        if ($isSummary) {
            // Tổng doanh thu và lợi nhuận all
            $stats = BillDetail::selectRaw("
            $groupBy as period,
            SUM(bill_details.quantity * bill_details.don_gia) as total_revenue,
            SUM((bill_details.don_gia - 500000) * bill_details.quantity) as total_profit
        ")                          // 500000 là giá vốn nhập sản phẩm
                ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
                ->when($date, function ($query, $date) {
                    $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
                })
                ->groupBy('period')
                ->get();
        } else {
            // Tổng doanh thu và lợi nhuận theo từng sản phẩm
            //     $stats = BillDetail::selectRaw("
            //     products.name as product_name,
            //     GROUP_CONCAT(DISTINCT attribute_values.value SEPARATOR ', ') as variation_details,
            //     $groupBy as period,
            //     SUM(bill_details.quantity * bill_details.don_gia) as total_revenue,
            //     SUM((bill_details.don_gia - 500000) * bill_details.quantity) as total_profit
            // ")
            //         ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
            //         ->join('products', 'bill_details.product_id', '=', 'products.id')
            //         ->join('product_variation_values', 'bill_details.product_variation_value_id', '=', 'product_variation_values.id')
            //         ->join('attribute_values', 'product_variation_values.attribute_value_id', '=', 'attribute_values.id')
            //         ->when($date, function ($query, $date) {
            //             $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
            //         })
            //         ->groupBy('period', 'bill_details.product_id', 'bill_details.product_variation_value_id')
            //         ->get();
            $stats = BillDetail::selectRaw("
                products.name as product_name,
                size_attribute.value as size,
                color_attribute.value as color,
                $groupBy as period,
                SUM(bill_details.quantity * bill_details.don_gia) as total_revenue,
                SUM((bill_details.don_gia - 500000) * bill_details.quantity) as total_profit
")
                ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
                ->join('products', 'bill_details.product_id', '=', 'products.id')
                ->join('product_variation_values as size_variation', 'bill_details.product_variation_value_id', '=', 'size_variation.id')
                ->join('attribute_values as size_attribute', 'size_variation.attribute_value_id', '=', 'size_attribute.id') // Join lấy size
                ->join('product_variations', 'size_variation.product_variation_id', '=', 'product_variations.id')
                ->join('attribute_values as color_attribute', 'product_variations.attribute_value_id', '=', 'color_attribute.id') // Join lấy color
                ->when($date, function ($query, $date) {
                    $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
                })
                ->groupBy('period', 'products.name', 'size', 'color')
                ->get();
        }
        return response()->json($stats);
    }

    // Thống kê người dùng mới
    public function getNewUsers(Request $request)
    {
        $date = $request->get('date');
        $newUsers = User::selectRaw('DATE(created_at) as date, COUNT(id) as total_users')
            ->when($date, function ($query, $date) {
                $query->whereBetween('created_at', [$date['start'], $date['end']]);
            })
            ->groupBy('date')
            ->get();

        return response()->json($newUsers);
    }

    public function getCustomerBehavior(Request $request)
    {
        $date = $request->get('date'); // Ngày, tháng hoặc năm

        $stats = [
            'total_product_views' => Product::when($date, function ($query, $date) {
                $query->whereBetween('created_at', [$date['start'], $date['end']]);
            })->count(),

            'total_cart_adds' => CartItem::when($date, function ($query, $date) {
                $query->whereBetween('created_at', [$date['start'], $date['end']]);
            })->count(),

            'total_wishlist_adds' => WishlistItem::when($date, function ($query, $date) {
                $query->whereBetween('created_at', [$date['start'], $date['end']]);
            })->count(),
        ];

        return response()->json($stats);
    }

    // Đơn hàng thành công
    public function getDeliveredOrderProducts(Request $request)
    {
        $date = $request->get('date');
        $completedOrderProducts = BillDetail::selectRaw('
            product_id, 
            SUM(quantity) as total_sold,
            SUM(quantity * don_gia) as total_revenue
        ')
            ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
            ->where('bills.status', Bill::STATUS_DELIVERED)
            ->applyDateFilter($date)  // Lọc theo ngày/tháng/năm nếu có
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->get();

        return response()->json($completedOrderProducts);
    }

    // đơn hàng bị hủy
    public function getCancelledOrderProducts(Request $request)
    {
        $date = $request->get('date');

        $cancelledOrderProducts = BillDetail::selectRaw('
            product_id, 
            SUM(quantity) as total_sold,
            SUM(quantity * don_gia) as total_revenue
        ')
            ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
            ->where('bills.status', Bill::STATUS_CANCELED)
            ->applyDateFilter($date)  // Lọc theo ngày/tháng/năm nếu có
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->get();

        return response()->json($cancelledOrderProducts);
    }

    public function updateDailyStatistics(Request $request)
    {
        $startDate = $request->input('startDate', now()->toDateString());
        $today = now()->toDateString();
        $statistics = [
            'date' => $today,
            // 'total_revenue' => Bill::whereDate('created_at', $today)->sum('total'),
            // 'total_profit' => Bill::whereDate('created_at', $today)->sum(DB::raw('total - 500000')),
            // 'total_orders' => Bill::whereDate('created_at', $today)->count(),
            // 'total_users' => User::whereDate('created_at', $today)->count(),
            // 'total_product_views' => Product::whereDate('created_at', $today)->count(),
            // 'total_cart_adds' => CartItem::whereDate('created_at', $today)->count(),
            // 'total_wishlist_adds' => WishlistItem::whereDate('created_at', $today)->count(),
            'total_revenue' => Bill::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $today)
                ->sum('total'),
            'total_profit' => Bill::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $today)
                ->sum(DB::raw('total - 500000')),
            'total_orders' => Bill::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $today)
                ->count(),
            'total_users' => User::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $today)
                ->count(),
            'total_product_views' => Product::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $today)
                ->count(),
            'total_cart_adds' => CartItem::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $today)
                ->count(),
            'total_wishlist_adds' => WishlistItem::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $today)
                ->count(),
        ];
        // $topProduct = BillDetail::selectRaw('product_id, SUM(quantity) as total_sold')
        //     ->whereHas('bill', function ($query) use ($today) {
        //         $query->whereDate('created_at', $today);
        //     })
        //     ->groupBy('product_id')
        //     ->orderByDesc('total_sold')
        //     ->first();
        // if ($topProduct) {
        //     $statistics['top_selling_product_id'] = $topProduct->product_id;
        //     $statistics['top_selling_quantity'] = $topProduct->total_sold;
        // }
        // Statistic::updateOrCreate(['date' => $today], $statistics);
        // return response()->json($statistics);
        $topProduct = BillDetail::selectRaw('product_id, SUM(quantity) as total_sold')
            ->whereHas('bill', function ($query) use ($startDate, $today) {
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $today);
            })
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->first();

        // Nếu có sản phẩm bán chạy nhất, thêm thông tin vào thống kê
        if ($topProduct) {
            $statistics['top_selling_product_id'] = $topProduct->product_id;
            $statistics['top_selling_quantity'] = $topProduct->total_sold;
        }

        // Cập nhật hoặc tạo mới bản ghi thống kê
        Statistic::updateOrCreate(['date' => $today], $statistics);

        return response()->json($statistics);
    }
}
