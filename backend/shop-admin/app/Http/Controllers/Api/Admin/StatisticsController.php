<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Product;
use App\Models\Statistic;
use App\Models\User;
use App\Models\WishlistItem;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Symfony\Component\Console\Input\Input;

class StatisticsController extends Controller
{
    // Thống kê sản phẩm theo lượt bán & sản phẩm bán chạy nhất (top 12)
    public function getTopSellingProducts(Request $request)
    {
        $currentDate = Carbon::now();

        $startDate = $currentDate->copy()->subMonth(1)->startOfMonth();
        $endDate = $currentDate->copy()->endOfMonth();
        // $date = $request->get('date', [
        //     'start' => $startOfOeriod->toDateString(),
        //     'end' => $endOfPeriod->toDateString()
        // ]);
        $products = BillDetail::selectRaw('product_id,SUM(quantity) as total_sold')
            ->whereHas('bill', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate])
                    ->whereIn('status_bill', ['delivered']);
            })
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->take(12)
            ->with('product')
            ->get();
        return response()->json($products);
    }

    // Top sản phẩm đánh giá cao và thấp
    public function getTopRatedProducts(Request $request)
    {
        $currentDate = Carbon::now();

        $startDate = $currentDate->copy()->subMonth(1)->startOfMonth();
        $endDate = $currentDate->copy()->endOfMonth();

        $topRatedProducts = Comment::selectRaw('product_id, AVG(stars) as average_stars, COUNT(id) as total_reviews')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('product_id')
            ->orderByDesc('average_stars')
            ->take(12)
            ->with('product')
            ->get();

        $lowRatedProducts = Comment::selectRaw('product_id, AVG(stars) as average_stars, COUNT(id) as total_reviews')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('product_id')
            ->orderBy('average_stars', 'asc')
            ->take(12)
            ->with('product')
            ->get();

        return response()->json([
            'top' => $topRatedProducts,
            'low' => $lowRatedProducts,
        ]);
    }


    // Thống kê doanh thu, lợi nhuận
    public function getRevenueAndProfit(Request $request)
    {
        $isSummary = $request->get('summary', false);
        // $date = $request->get('date');
        $year = $request->get('year');
        $month = $request->get('month');
        $groupByType = $request->get('group_by', 'month');

        switch ($groupByType) {
            case 'month':
            default:
                $groupBy = "CONCAT(YEAR(bills.created_at), '-', LPAD(MONTH(bills.created_at), 2, '0'))";
                break;
            case 'year':
                $groupBy = "YEAR(bills.created_at)";
                break;
            case 'day':
                $groupBy = "DATE(bills.created_at)";
                break;
        }
        // Tổng doanh thu và lợi nhuận all
        $query = BillDetail::selectRaw("
            $groupBy as period,
            SUM(bill_details.quantity * bill_details.don_gia) as total_revenue,
            SUM((bill_details.don_gia - table_product_costs.cost_price) * bill_details.quantity) as total_profit
        ")
            ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
            ->join('table_product_costs', 'bill_details.product_id', '=', 'table_product_costs.product_id');

        if ($year) {
            $query->whereYear('bills.created_at', $year);
        }

        if ($month) {
            $query->whereMonth('bills.created_at', $month);
        }

        $date = $request->get('date');
        if ($date) {
            $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
        }

        if ($isSummary) {
            $stats = $query->groupBy('period')->get();
        } else {
            $stats = BillDetail::selectRaw("
                products.id as product_id,
                products.name as product_name,
                size_attribute.value as size,
                color_attribute.value as color,
                $groupBy as period,
                SUM(bill_details.quantity * bill_details.don_gia) as total_revenue,
                SUM((bill_details.don_gia - table_product_costs.cost_price) * bill_details.quantity) as total_profit
                    ")
                ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
                ->join('products', 'bill_details.product_id', '=', 'products.id')
                ->join('product_variation_values as size_variation', 'bill_details.product_variation_value_id', '=', 'size_variation.id')
                ->join('attribute_values as size_attribute', 'size_variation.attribute_value_id', '=', 'size_attribute.id')
                ->join('product_variations', 'size_variation.product_variation_id', '=', 'product_variations.id')
                ->join('attribute_values as color_attribute', 'product_variations.attribute_value_id', '=', 'color_attribute.id')
                ->join('table_product_costs', 'products.id', '=', 'table_product_costs.product_id');
            // ->when($date, function ($query, $date) {
            //     $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
            // });
            if ($year) {
                $stats = $stats->whereYear('bills.created_at', $year);
            }
            if ($month) {
                $stats = $stats->whereMonth('bills.created_at', $month);
            }
            if ($date) {
                $stats->whereBetween('bills.created_at', [$date['start'], $date['end']]);
            }
            $stats = $stats->groupBy('period', 'products.id', 'products.name', 'size', 'color')->get();
        }
        return response()->json($stats);
    }

    public function getRevenueAndProfitByCategory(Request $request)
    {
        $isSummary = $request->get('summary', false);
        $date = $request->get('date');
        $groupByType = $request->get('group_by', 'month');

        // Chọn nhóm theo ngày, tháng, hoặc năm
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
            // Tổng doanh thu và lợi nhuận theo danh mục
            $stats = BillDetail::selectRaw("
            $groupBy as period,
            categories.name as category_name,
            SUM(bill_details.quantity * bill_details.don_gia) as total_revenue,
            SUM((bill_details.don_gia - table_product_costs.cost_price) * bill_details.quantity) as total_profit
        ")
                ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
                ->join('products', 'bill_details.product_id', '=', 'products.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->join('table_product_costs', 'bill_details.product_id', '=', 'table_product_costs.product_id')
                ->when($date, function ($query, $date) {
                    $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
                })
                ->groupBy('period', 'category_name')
                ->get();
        } else {
            // Doanh thu và lợi nhuận theo từng sản phẩm trong từng danh mục
            $stats = BillDetail::selectRaw("
            products.name as product_name,
            categories.name as category_name,
            $groupBy as period,
            SUM(bill_details.quantity * bill_details.don_gia) as total_revenue,
            SUM((bill_details.don_gia - table_product_costs.cost_price) * bill_details.quantity) as total_profit
        ")
                ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
                ->join('products', 'bill_details.product_id', '=', 'products.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->join('table_product_costs', 'bill_details.product_id', '=', 'table_product_costs.product_id')
                ->when($date, function ($query, $date) {
                    $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
                })
                ->groupBy('period', 'product_name', 'category_name')
                ->get();
        }

        return response()->json($stats);
    }

    public function getProductStock(Request $request)
    {
        $date = $request->get('date');

        $stockStats = Product::selectRaw("
        products.name as product_name,
        products.stock as stock
    ")
            ->when($date, function ($query, $date) {
                $query->whereDate('products.created_at', '>=', $date['start'])
                    ->whereDate('products.created_at', '<=', $date['end']);
            })
            ->get();

        return response()->json($stockStats);
    }



    // Thống kê người dùng mới
    // public function getNewUsers(Request $request)
    // {
    //     $date = $request->get('date');
    //     $newUsers = User::selectRaw('DATE(created_at) as date, COUNT(id) as total_users')
    //         ->when($date, function ($query, $date) {
    //             $query->whereBetween('created_at', [$date['start'], $date['end']]);
    //         })
    //         ->groupBy('date')
    //         ->get();

    //     return response()->json($newUsers);
    // }

    public function getNewUsers(Request $request)
    {
        $date = $request->get('date');
        $year = $request->get('year');
        $month = $request->get('month');
        $group_by = $request->get('group_by', 'month');
        $summary = $request->get('summary', false);

        // $newUsers = User::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(id) as total_users')
        //     ->when($date, function ($query, $date) {
        //         $query->whereBetween('created_at', [$date['start'], $date['end']]);
        //     })
        //     ->when($year, function ($query) use ($year) {
        //         $query->whereYear('created_at', $year);
        //     })
        //     ->when($month, function ($query) use ($month) {
        //         $query->whereMonth('created_at', $month);
        //     })
        //     ->groupBy('year', 'month')
        //     ->orderBy('year', 'asc')
        //     ->orderBy('month', 'asc')
        //     ->get();

        // return response()->json($newUsers);
        $newUsers = User::selectRaw(
            match ($group_by) {
                'day' => 'DATE(created_at) as period, COUNT(id) as total_users',
                'month' => 'YEAR(created_at) as year, MONTH(created_at) as month, COUNT(id) as total_users',
                'year' => 'YEAR(created_at) as year, COUNT(id) as total_users',
                default => 'YEAR(created_at) as year, MONTH(created_at) as month, COUNT(id) as total_users',
            }
        )
            ->when($date, function ($query, $date) {
                $query->whereBetween('created_at', [$date['start'], $date['end']]);
            })
            ->when($year, function ($query) use ($year) {
                $query->whereYear('created_at', $year);
            })
            ->when($month, function ($query) use ($month) {
                $query->whereMonth('created_at', $month);
            })
            ->groupByRaw(
                match ($group_by) {
                    'day' => 'DATE(created_at)',
                    'month' => 'YEAR(created_at), MONTH(created_at)',
                    'year' => 'YEAR(created_at)',
                    default => 'YEAR(created_at), MONTH(created_at)',
                }
            )
            ->orderByRaw(
                match ($group_by) {
                    'day' => 'DATE(created_at) ASC',
                    'month' => 'YEAR(created_at) ASC, MONTH(created_at) ASC',
                    'year' => 'YEAR(created_at) ASC',
                    default => 'YEAR(created_at) ASC, MONTH(created_at) ASC',
                }
            )
            ->get();

        // Nếu cần tính tổng
        if ($summary) {
            $summaryData = User::selectRaw('COUNT(id) as total_users')
                ->when($date, function ($query, $date) {
                    $query->whereBetween('created_at', [$date['start'], $date['end']]);
                })
                ->when($year, function ($query) use ($year) {
                    $query->whereYear('created_at', $year);
                })
                ->when($month, function ($query) use ($month) {
                    $query->whereMonth('created_at', $month);
                })
                ->first();

            return response()->json([
                'data' => $newUsers,
                'summary' => [
                    'total_users' => $summaryData->total_users ?? 0,
                ],
            ]);
        }
        return response()->json($newUsers);
    }


    public function getCustomerBehavior(Request $request)
    {
        $date = $request->get('date');

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

    public function getOrderStatistics(Request $request)
    {
        $dateRange = $request->get('date');
        $year = $request->get('year');
        $month = $request->get('month');

        $query = \DB::table('bills')
            ->select(
                \DB::raw('YEAR(created_at) as year'),
                \DB::raw('MONTH(created_at) as month'),
                \DB::raw('SUM(CASE WHEN status_bill = "' . Bill::STATUS_DELIVERED . '" THEN 1 ELSE 0 END) as total_delivered'),
                \DB::raw('SUM(CASE WHEN status_bill = "' . Bill::STATUS_CANCELED . '" THEN 1 ELSE 0 END) as total_canceled')
            )
            ->when($dateRange, function ($query) use ($dateRange) {
                $query->whereBetween('created_at', [$dateRange['start'], $dateRange['end']]);
            })
            ->when($year, function ($query) use ($year) {
                $query->whereYear('created_at', $year);
            })
            ->when($month, function ($query) use ($month) {
                $query->whereMonth('created_at', $month);
            })
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        $sumYearly = null;
        if ($year && !$month) {
            $sumYearly = $query->groupBy('year')->map(function ($yearGroup) {
                return [
                    'delivered' => $yearGroup->sum('total_delivered'),
                    'canceled' => $yearGroup->sum('total_canceled'),
                ];
            });
        }
        return response()->json([
            'data' => $query,
            'sum_yearly' => $sumYearly
        ]);

        return response()->json($query);
    }




    // Đơn hàng thành công
    // public function getDeliveredOrderProducts(Request $request)
    // {
    //     $date = $request->get('date');

    //     $completedOrderProducts = BillDetail::join('bills', 'bill_details.bill_id', '=', 'bills.id')
    //         ->join('products', 'bill_details.product_id', '=', 'products.id')
    //         ->select(
    //             'bill_details.product_id',
    //             'products.name as product_name',
    //             'products.price',
    //             'products.category_id',
    //             \DB::raw('SUM(bill_details.quantity) as total_sold'),
    //             \DB::raw('SUM(bill_details.quantity * bill_details.don_gia) as total_revenue')
    //         )
    //         ->where('bills.status_bill', Bill::STATUS_DELIVERED)
    //         ->when(
    //             $date,
    //             function ($query) use ($date) {
    //                 $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
    //             }
    //         )
    //         ->groupBy('bill_details.product_id', 'products.name', 'products.price', 'products.category_id')
    //         ->orderByDesc('total_sold')
    //         ->get();

    //     return response()->json($completedOrderProducts);
    // }



    // đơn hàng bị hủy
    // public function getCancelledOrderProducts(Request $request)
    // {
    //     $date = $request->get('date');

    //     $cancelledOrderProducts = BillDetail::join('bills', 'bill_details.bill_id', '=', 'bills.id')
    //         ->join('products', 'bill_details.product_id', '=', 'products.id')
    //         ->select(
    //             'bill_details.product_id',
    //             'products.name as product_name',
    //             'products.price',
    //             'products.category_id',
    //             \DB::raw('SUM(bill_details.quantity) as total_sold'),
    //             \DB::raw('SUM(bill_details.quantity * bill_details.don_gia) as total_revenue')
    //         )
    //         ->where('bills.status_bill', Bill::STATUS_CANCELED)
    //         ->when(
    //             $date,
    //             function ($query) use ($date) {
    //                 $query->whereBetween('bills.created_at', [$date['start'], $date['end']]);
    //             }
    //         )
    //         ->groupBy('bill_details.product_id', 'products.name', 'products.price', 'products.category_id')
    //         ->orderByDesc('total_sold')
    //         ->get();

    //     return response()->json($cancelledOrderProducts);
    // }


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
            'total_profit' => Bill::selectRaw('SUM(bills.total - table_product_costs.cost_price) as total_profit')
                ->join('bill_details', 'bills.id', '=', 'bill_details.bill_id')
                ->join('table_product_costs', 'bill_details.product_id', '=', 'table_product_costs.product_id')
                ->whereDate('bills.created_at', '>=', $startDate)
                ->whereDate('bills.created_at', '<=', $today)
                ->value('total_profit'),
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

        if ($topProduct) {
            $statistics['top_selling_product_id'] = $topProduct->product_id;
            $statistics['top_selling_quantity'] = $topProduct->total_sold;
        }

        Statistic::updateOrCreate(['date' => $today], $statistics);

        return response()->json($statistics);
    }
}
