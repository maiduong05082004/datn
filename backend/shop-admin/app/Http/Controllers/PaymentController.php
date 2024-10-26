<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function savePayment($request, $paymentMethod, $redirectUrl)
    {
        Payment::create([
            'bill_id' => $request->bill_id,
            'user_id' => auth()->id(), // Hoặc lấy từ session
            'payment_method' => $paymentMethod,
            'amount' => $request->amount,
            'status' => 'pending',
            'order_info' => $request->order_info,
            'pay_type' => 'online',
        ]);
    }
}
