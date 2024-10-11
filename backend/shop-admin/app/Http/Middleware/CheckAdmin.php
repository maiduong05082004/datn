<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::guard('sanctum')->user();
    
        if ($user && $user->role === 'admin') {
            return $next($request);
        }
    
        return response()->json(['error' => 'Bạn không có quyền truy cập trang admin.'], 403);
    }
}