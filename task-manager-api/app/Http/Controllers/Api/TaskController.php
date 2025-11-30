<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth'); // protect with tymon/jwt-auth
    }

    // GET /api/tasks
    public function index(Request $request)
    {
        $user = $request->user();

        // Optional: support filtering by status via query string ?status=pending
        // Admin users see all tasks; regular users see only their own
        if ($user->role === 'admin') {
            $query = Task::with('user');
        } else {
            $query = Task::where('user_id', $user->id)->with('user');
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $tasks = $query->orderBy('created_at','desc')->get();

        return response()->json(['data' => $tasks], 200);
    }

    // POST /api/tasks
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $task = Task::create($data);

        return response()->json(['data' => $task], 201);
    }

    // PUT /api/tasks/{id}
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

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
