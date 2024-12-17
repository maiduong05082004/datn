<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShippingRequest\UpdateShippingRequest;
use App\Models\Bill;
use App\Models\ShippingAddress;
use Auth;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    
    public function show($id)
    {
     $bill= Bill::findOrFail($id);

     $data = ShippingAddress::findOrFail($bill->shipping_address_id);
        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

  
    public function update(UpdateShippingRequest $request, $id)
    {
       
  $user = ShippingAddress::findOrFail($id);
            $user->update($request->all());

 

        return response()->json([
            'success' => true,
            'message' => 'Địa chỉ giao hàng đã được cập nhật thành công.',
            'data' => $user,
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