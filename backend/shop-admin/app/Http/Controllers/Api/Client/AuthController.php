<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Request data:', $request->all());
        $data = $request->all();

        $requiredFields = ['name', 'email', 'password', 'sex', 'date_of_birth'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            return response()->json([
                'error' => 'Missing required fields',
                'missing_fields' => $missingFields
            ], 400);
        }

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

        return response()->json([
            'message' => 'User registered successfully',
        ], 201);
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
        $token = $user->createToken('user-token')->plainTextToken;
        return response()->json([
            'token' => $token,
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
        ]);
    }

    public function redirectToGoogle()
    {
        $scopes = ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read'];
        $redirectUrl = env('GOOGLE_REDIRECT_URI', 'http://localhost:8000/api/auth/callback/google');
        $url = Socialite::driver('google')
            ->stateless()
            ->redirectUrl($redirectUrl)
            ->scopes($scopes)
            ->redirect()
            ->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            $code = $request->input('code');
            if (!$code) {
                throw new \Exception('Missing code parameter');
            }
            $tokenResponse = Socialite::driver('google')->stateless()->getAccessTokenResponse($code);
            if (!isset($tokenResponse['access_token'])) {
                throw new \Exception('Failed to retrieve access token');
            }
            $accessToken = $tokenResponse['access_token'];
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($accessToken);
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
            return redirect("http://localhost:5173/auth/google/callback?token=$token");
        } catch (\Exception $e) {
            Log::error('Google login failed: ' . $e->getMessage());
            return response()->json(['error' => 'Google login failed'], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['status' => __($status)], 200)
            : response()->json(['email' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successfully'], 200)
            : response()->json(['email' => [__($status)]], 400);
    }
}
