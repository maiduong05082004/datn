<?php

namespace Database\Factories;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'product_id' => \App\Models\Product::factory(),
            'content' => fake()->paragraph(),
            'commentDate' => fake()->dateTime(),
            'is_reported' => fake()->boolean(),
            'reported_count' => fake()->numberBetween(0, 10),
            'moderation_status' => fake()->randomElement([
                Comment::STATUS_PENDING,
                Comment::STATUS_APPROVED,
                Comment::STATUS_REJECTED
            ]),
            'is_visible' => fake()->boolean(),
            'parent_id' => null,
            'stars' => fake()->numberBetween(1, 5),
            'like' => fake()->numberBetween(0, 100),
            'is_anonymous' => fake()->boolean(),
        ];
    }
} 