<?php

namespace Database\Factories;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Factories\Factory;

class BannerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => \App\Models\Category::factory(),
            'title' => fake()->sentence(),
            'image_path' => fake()->imageUrl(),
            'link' => fake()->url(),
            'type' => fake()->randomElement([
                Banner::TYPE_MAIN,
                Banner::TYPE_CATEGORY,
                Banner::TYPE_CUSTOM
            ]),
            'status' => fake()->boolean(),
        ];
    }
} 