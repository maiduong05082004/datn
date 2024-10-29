<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasPurchasedProduct
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $productId = $request->product_id;

        // check user đã mua hàng hay chưa?
        // $hasPurchased = \App\Models\Order::where('user_id', $user->id);
        return $next($request);
    }
}
