<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingAddressFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'full_name' => fake()->name(),
            'address_line' => fake()->streetAddress(),
            'city' => fake()->city(),
            'district' => fake()->numberBetween(1, 30),
            'ward' => fake()->numberBetween(1, 20),
            'phone_number' => fake()->phoneNumber(),
            'is_default' => fake()->boolean(),
        ];
    }
} 