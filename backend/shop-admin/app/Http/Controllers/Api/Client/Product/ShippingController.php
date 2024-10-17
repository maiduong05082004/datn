<?php

namespace App\Http\Controllers\Api\Client\Product;

use App\Http\Controllers\Controller;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShippingController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $shippingAddresses = $user->shippingAddresses()->get();

        return response()->json([
            'success' => true,
            'data' => $shippingAddresses,
        ], 200);
    }

    /**
     * Lưu một địa chỉ giao hàng mới.
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'address_line' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'is_default' => 'boolean',
        ]);

        $user = Auth::user();

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

    /**
     * Cập nhật một địa chỉ giao hàng.
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'address_line' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'is_default' => 'boolean',
        ]);

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

    /**
     * Xoá một địa chỉ giao hàng.
     */
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
