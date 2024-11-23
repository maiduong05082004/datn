<?php

namespace App\Http\Controllers\Api\Client\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShippingRequest\StoreShippingRequest;
use App\Http\Requests\ShippingRequest\UpdateShippingRequest;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ShippingController extends Controller
{
 
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng đã đăng nhập.',
            ], 401);
        }

        $shippingAddresses = $user->shippingAddresses;

        return response()->json([
            'success' => true,
            'data' => $shippingAddresses,
        ], 200);
    }

    public function store(StoreShippingRequest $request)
    {
        $user = Auth::user();
    
        if (!$user) {

            return response()->json([
                'success' => false,
                'message' => 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
            ], 401);
        }
    
        $this->validate($request, [
            'address_line' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'is_default' => 'boolean',
            'full_name' => 'required|string|max:255', // Thêm validation cho full_name
        ]);
        
    
        if ($user->shippingAddresses()->count() >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn chỉ có thể thêm tối đa 5 địa chỉ giao hàng.',
            ], 403);
        }
    
        DB::transaction(function () use ($request, $user) {
            $shippingAddress = $user->shippingAddresses()->create($request->all());
    
            if ($request->is_default) {
                $user->shippingAddresses()
                    ->where('id', '!=', $shippingAddress->id)
                    ->update(['is_default' => 0]);
            }
        });
    
        return response()->json([
            'success' => true,
            'message' => 'Địa chỉ giao hàng đã được thêm thành công.',
        ], 201);
    }
    
  
    public function show($id)
    {
        $user = Auth::user();

        $shippingAddress = $user->shippingAddresses()->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $shippingAddress,
        ], 200);
    }

  
    public function update(UpdateShippingRequest $request, $id)
    {
       

        $user = Auth::user();

        $shippingAddress = $user->shippingAddresses()->findOrFail($id);

        DB::transaction(function () use ($request, $shippingAddress, $user) {
            $shippingAddress->update($request->all());

            if ($request->is_default) {
                $user->shippingAddresses()
                    ->where('id', '!=', $shippingAddress->id)
                    ->update(['is_default' => 0]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Địa chỉ giao hàng đã được cập nhật thành công.',
            'data' => $shippingAddress,
        ], 200);
    }

  
    public function destroy($id)
    {
        $user = Auth::user();

        $shippingAddress = $user->shippingAddresses()->findOrFail($id);

        $shippingAddress->delete();

        return response()->json([
            'success' => true,
            'message' => 'Địa chỉ giao hàng đã được xoá thành công.',
        ], 200);
    }
}
