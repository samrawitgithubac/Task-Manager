<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        // Validate input
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        // Create user (assign admin role for the configured admin email)
        $role = ($request->email === 'sams@mail.com') ? 'admin' : 'user';
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
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
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Validate
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Attempt login
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Ensure the configured admin email always has admin role
        $user = auth()->user();
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
