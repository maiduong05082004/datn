<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductVariationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => \App\Models\Product::factory(),
            'group_id' => \App\Models\Group::factory(),
            'attribute_value_id' => \App\Models\AttributeValue::factory(),
            'stock' => fake()->numberBetween(0, 100),
        ];
    }
} 