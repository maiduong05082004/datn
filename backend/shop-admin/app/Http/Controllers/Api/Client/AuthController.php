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
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;

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

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Tạo token chứa email mã hóa
        $payload = [
            'email' => $user->email,
        ];
        $token = Crypt::encrypt($payload);

        // Link reset password chứa token
        $resetLink = "http://localhost:5173/reset-password/{$token}";

        // Gửi email quên mật khẩu
        Mail::to($user->email)->send(new \App\Mail\ResetPasswordMail($resetLink));

        return response()->json(['message' => 'Reset password email sent successfully.'], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        try {
            // Giải mã token
            $payload = Crypt::decrypt($request->token);
            $email = $payload['email'];

            // Tìm người dùng qua email
            $user = User::where('email', $email)->first();

            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            // Cập nhật mật khẩu người dùng
            $user->forceFill([
                'password' => Hash::make($request->password),
            ])->setRememberToken(Str::random(60));

            $user->save();

            return response()->json(['message' => 'Password has been reset successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid or expired token.'], 400);
        }
    }
    public function updateUserInfo(Request $request)
    {
        $user = $request->user(); // Lấy thông tin người dùng đang đăng nhập

        // Xác thực dữ liệu đầu vào
        $request->validate([
            'name' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'sex' => 'nullable|string|in:male,female,other',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:500',
        ]);

        try {
            // Cập nhật thông tin người dùng
            $user->update($request->only(['name', 'date_of_birth', 'sex', 'phone', 'address']));

            return response()->json([
                'message' => 'User information updated successfully.',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user information.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function addPoints(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $pointsEarned = floor($request->amount / 10000);
        $user->points += $pointsEarned;
        $user->save();

        return response()->json([
            'message' => 'Points added successfully.',
            'points_earned' => $pointsEarned,
            'total_points' => $user->points,
        ], 200);
    }
    // public function calculateTier()
    // {
    //     if ($this->points >= 2000) {
    //         $this->tier = 'Diamond';
    //     } elseif ($this->points >= 1000) {
    //         $this->tier = 'Gold';
    //     } elseif ($this->points >= 500) {
    //         $this->tier = 'Silver';
    //     } else {
    //         $this->tier = 'Bronze';
    //     }

    //     $this->save(); // Cập nhật vào cơ sở dữ liệu
    // }
}
