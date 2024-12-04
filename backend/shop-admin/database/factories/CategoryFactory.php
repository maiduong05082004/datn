<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'image' => fake()->imageUrl(),
            'parent_id' => null,
            'status' => fake()->boolean(),
        ];
    }
} 