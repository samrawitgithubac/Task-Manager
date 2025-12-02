<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        .task-details {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .task-detail-row {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .task-detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
            display: inline-block;
            width: 120px;
        }
        .value {
            color: #111827;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-pending {
            background-color: #FEF3C7;
            color: #92400E;
        }
        .status-in-progress {
            background-color: #DBEAFE;
            color: #1E40AF;
        }
        .status-completed {
            background-color: #D1FAE5;
            color: #065F46;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">
            @if($action === 'assigned')
                New Task Assigned
            @else
                Task Updated
            @endif
        </h1>
    </div>
    
    <div class="content">
        <p>Hello {{ $task->user->name }},</p>
        
        @if($action === 'assigned')
            <p>A new task has been assigned to you:</p>
        @else
            <p>Your task has been updated:</p>
        @endif

        <div class="task-details">
            <div class="task-detail-row">
                <span class="label">Title:</span>
                <span class="value"><strong>{{ $task->title }}</strong></span>
            </div>
            
            @if($task->description)
            <div class="task-detail-row">
                <span class="label">Description:</span>
                <span class="value">{{ $task->description }}</span>
            </div>
            @endif
            
            <div class="task-detail-row">
                <span class="label">Status:</span>
                <span class="value">
                    <span class="status-badge status-{{ str_replace('-', '', $task->status) }}">
                        {{ ucfirst(str_replace('-', ' ', $task->status)) }}
                    </span>
                </span>
            </div>
            
            @if($task->due_date)
            <div class="task-detail-row">
                <span class="label">Due Date:</span>
                <span class="value">{{ $task->due_date->format('F j, Y g:i A') }}</span>
            </div>
            @endif
            
            <div class="task-detail-row">
                <span class="label">Created:</span>
                <span class="value">{{ $task->created_at->format('F j, Y g:i A') }}</span>
            </div>
        </div>

        <p>Please log in to your account to view and manage this task.</p>
    </div>

    <div class="footer">
        <p>This is an automated notification from Task Manager.</p>
        <p>Please do not reply to this email.</p>
    </div>
</body>
</html>

