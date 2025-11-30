<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function update(User $user, Task $task)
    {
        // Admins can update any task; regular users can only update their own
        return ($user->role === 'admin') || ($user->id === $task->user_id);
    }

    public function delete(User $user, Task $task)
    {
        // Admins can delete any task; regular users can only delete their own
        return ($user->role === 'admin') || ($user->id === $task->user_id);
    }
}
