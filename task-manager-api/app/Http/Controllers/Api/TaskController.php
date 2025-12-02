<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Mail\TaskNotification;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth'); // protect with tymon/jwt-auth
    }

    // GET /api/tasks
    public function index(Request $request)
    {
        // Get authenticated user ID from JWT
        $userId = $request->user()->id;
        
        // Fetch user from database to ensure we have the latest role
        $user = User::find($userId);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Optional: support filtering by status via query string ?status=pending
        // Admin users see all tasks by default; regular users see only their own
        // Check role with case-insensitive comparison and handle null
        $userRole = $user->role ?? null;
        $isAdmin = $userRole && strtolower(trim($userRole)) === 'admin';
        
        if ($isAdmin) {
            // Support owners filter for admin users: owners=mine (to see only their own tasks)
            $owners = $request->query('owners');
            
            if ($owners === 'mine') {
                // Admin wants only their own tasks
                $query = Task::where('user_id', $user->id)->with('user');
            } else {
                // Default: admins see all tasks from all users
                $query = Task::with('user');
            }
        } else {
            // Regular users see only their own tasks
            $query = Task::where('user_id', $user->id)->with('user');
        }

        // Filter by status if provided
        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Sorting: support sort_by and sort_order parameters
        $sortBy = $request->query('sort_by', 'created_at'); // default to created_at
        $sortOrder = $request->query('sort_order', 'desc'); // default to desc
        
        // Validate sort_by field
        $allowedSortFields = ['created_at', 'due_date', 'title', 'status'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }
        
        // Validate sort_order
        $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';
        
        // Handle null due_date values when sorting by due_date
        if ($sortBy === 'due_date') {
            // Put null values at the end
            if ($sortOrder === 'asc') {
                $query->orderByRaw('due_date IS NULL ASC')->orderBy('due_date', 'asc');
            } else {
                $query->orderByRaw('due_date IS NULL ASC')->orderBy('due_date', 'desc');
            }
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $tasks = $query->get();

        return response()->json(['data' => $tasks], 200);
    }

    // POST /api/tasks
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $task = Task::create($data);
        
        // Load the user relationship for email notification
        $task->load('user');
        
        // Send email notification to the task owner
        try {
            Mail::to($task->user->email)->send(new TaskNotification($task, 'assigned'));
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('Failed to send task assignment email: ' . $e->getMessage());
        }

        return response()->json(['data' => $task], 201);
    }

    // PUT /api/tasks/{id}
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        // Store original values to check if status changed
        $originalStatus = $task->status;
        
        $task->update($request->validated());
        
        // Reload the task with user relationship
        $task->refresh();
        $task->load('user');
        
        // Send email notification if task was updated
        // Only send if status changed or if other significant fields changed
        $statusChanged = $originalStatus !== $task->status;
        $significantChange = $statusChanged || 
                            $request->has('title') || 
                            $request->has('due_date') ||
                            $request->has('description');
        
        if ($significantChange) {
            try {
                Mail::to($task->user->email)->send(new TaskNotification($task, 'updated'));
            } catch (\Exception $e) {
                // Log error but don't fail the request
                \Log::error('Failed to send task update email: ' . $e->getMessage());
            }
        }

        return response()->json(['data' => $task], 200);
    }

    // DELETE /api/tasks/{id}
    public function destroy(Request $request, Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }
}
