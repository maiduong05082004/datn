<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'sex' => 'required|string|in:male,female,other',
            'date_of_birth' => 'required|date',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'sex' => $request->sex,
            'date_of_birth' => $request->date_of_birth,
            'role' => User::Role_User,
            'is_active' => true,
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('token-name')->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'role' => $request->user()->role,
        ]);
    }
    

    public function redirectToGoogle()
    {
        $scopes = ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read'];
        $url = Socialite::driver('google')->stateless()->scopes($scopes)->redirect()->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $existingUser = User::where('email', $googleUser->getEmail())->first();

            if ($existingUser) {
                $user = $existingUser;
            } else {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'provider_name' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(16)),
                    'role' => User::Role_User,
                    'is_active' => true,
                    'sex' => $googleUser->user['gender'] ?? null,
                    'date_of_birth' => $googleUser->user['birthday'] ?? null,
                ]);
            }

            $token = $user->createToken('authToken')->plainTextToken;

            return redirect("http://localhost:3000/auth/google/callback?token=$token");
        } catch (\Exception $e) {
            return response()->json(['error' => 'Google login failed'], 500);
        }
    }
}
