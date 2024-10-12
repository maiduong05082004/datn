<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password) || $user->role !== 'admin') {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect or not an admin.'],
            ]);
        }

        $token = $user->createToken('admin-token')->plainTextToken;
        return response()->json([
            'token' => $token,
        ], 200);
    }
}