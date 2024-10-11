<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'password' => Hash::make($request->password),
        ]);
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrfail($id);
        if (!$user->is_active) {
            return response()->json(['message' => 'user đã bị khóa'], 403);
        }
        return response()->json($user, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'password' => Hash::make($request->password),
        ]);

        if ($request->password) {
            $user->update(['password' => Hash::make($request->password)]);
        }
        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function blockUser($id)
    {
        $user = User::findOrFail($id);
        if (!$user->is_active) {
            return response()->json(['message' => 'User sắp bị khóa'], 400);
        }
        $user->is_active = false;
        $user->save();
        return response()->json(['message' => 'User đã bị khóa'], 200);
    }

    public function unblockUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->is_active) {
            return response()->json(['message' => 'User không bị khóa'], 400);
        }
        $user->is_active = true;
        $user->save();
        return response()->json(['message' => 'User đã được mở khóa'], 200);
    }
}
