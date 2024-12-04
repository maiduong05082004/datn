<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
            'date_of_birth' => fake()->date(),
            'sex' => fake()->randomElement(['male', 'female', 'other']),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'role' => fake()->randomElement(['admin', 'user']),
            'is_active' => fake()->boolean(),
            'points' => fake()->numberBetween(0, 1000),
            'tier' => fake()->randomElement(['bronze', 'silver', 'gold']),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
