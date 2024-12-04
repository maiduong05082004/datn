<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PromotionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => strtoupper(Str::random(8)),
            'description' => fake()->sentence(),
            'start_date' => fake()->dateTimeBetween('now', '+1 week'),
            'end_date' => fake()->dateTimeBetween('+1 week', '+1 month'),
            'discount_amount' => fake()->numberBetween(5, 50),
            'max_discount_amount' => fake()->numberBetween(100000, 500000),
            'discount_type' => fake()->randomElement(['percentage', 'amount']),
            'usage_limit' => fake()->numberBetween(10, 100),
            'min_order_value' => fake()->numberBetween(100000, 1000000),
            'promotion_type' => fake()->randomElement(['product', 'shipping']),
            'is_active' => fake()->boolean(),
            'status' => fake()->boolean(),
        ];
    }
} 