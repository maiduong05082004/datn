<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $orderData;

    public function __construct($orderData)
    {
        $this->orderData = $orderData;
    }

    public function build()
    {
        return $this->view('emails.order_confirmation')
                    ->with([
                        'customerName' => $this->orderData['customerName'],
                        'orderId' => $this->orderData['orderId'],
                        'orderDate' => $this->orderData['orderDate'],
                        'paymentType' => $this->orderData['paymentType'],
                        'payment_method' => $this->orderData['payment_method'] ??null, // Thêm dòng này
                        'status' => $this->orderData['status'] ??null, // Thêm dòng này
                        'shippingAddress' => $this->orderData['shippingAddress'],
                        'phoneNumber' => $this->orderData['phoneNumber'],
                        'orderItems' => $this->orderData['orderItems'],  
                        'shipping_fee' => $this->orderData['shipping_fee'],  
                        'discounted_amount' => $this->orderData['discounted_amount'],  
                        'discounted_shipping_fee' => $this->orderData['discounted_shipping_fee'],  
                        'totalAmount' => $this->orderData['totalAmount'],
                    ])
                    ->subject('Xác Nhận Đơn Hàng');
    }
}