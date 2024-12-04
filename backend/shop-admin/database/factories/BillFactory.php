<?php

namespace Database\Factories;

use App\Models\Bill;
use Illuminate\Database\Eloquent\Factories\Factory;

class BillFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code_orders' => 'ORD-' . fake()->unique()->randomNumber(6),
            'user_id' => \App\Models\User::factory(),
            'email_receiver' => fake()->email(),
            'note' => fake()->sentence(),
            'status_bill' => fake()->randomElement([
                Bill::STATUS_PENDING,
                Bill::STATUS_PROCESSED,
                Bill::STATUS_SHIPPED,
                Bill::STATUS_DELIVERED
            ]),
            'subtotal' => fake()->numberBetween(100000, 1000000),
            'total' => fake()->numberBetween(100000, 1000000),
            'payment_type' => fake()->randomElement(['online', 'cod']),
            'shipping_fee' => fake()->numberBetween(20000, 50000),
        ];
    }
} 