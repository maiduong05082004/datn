<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true);
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'price' => fake()->numberBetween(100000, 1000000),
            'stock' => fake()->numberBetween(0, 100),
            'description' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'view' => fake()->numberBetween(0, 1000),
            'input_day' => fake()->date(),
            'category_id' => \App\Models\Category::factory(),
            'is_collection' => fake()->boolean(),
            'is_hot' => fake()->boolean(),
            'is_new' => fake()->boolean(),
        ];
    }
} 