<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // REGISTER
    public function register(RegisterRequest $request)
    {
        // validated data from RegisterRequest
        $data = $request->validated();

        // Backend controls role: set admin for configured email if needed, otherwise 'user'
        $role = ($data['email'] === 'sams@mail.com') ? 'admin' : 'user';

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $role,
        ]);

        // Create JWT token
        $token = JWTAuth::fromUser($user);

        // Return response
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // LOGIN
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        // Attempt login
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        $user = auth()->user();

        // Ensure configured admin email always has admin role
        if ($user && $user->email === 'sams@mail.com' && $user->role !== 'admin') {
            $user->role = 'admin';
            $user->save();
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    // LOGOUT
    public function logout()
    {
        auth()->logout();

        return response()->json([
            'message' => 'User logged out successfully'
        ]);
    }

    // OPTIONAL: Get current user
    public function me()
    {
        return response()->json(auth()->user());
    }
}
