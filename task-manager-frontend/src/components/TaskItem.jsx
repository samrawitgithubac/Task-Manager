import React from "react";

export default function TaskItem({ task, onEdit, onDelete }) {
  return (
    <div className="task-item simple-box compact">
      <div className="task-row">
        <div>
          <strong>{task.title}</strong>
          <div className="muted">{task.description}</div>
          {task.due_date ? (
            <div className="muted">Due: {new Date(task.due_date).toLocaleString()}</div>
          ) : null}
          {task.user ? (
            <div className="muted">Owner: {task.user.name} {task.user.email ? `(${task.user.email})` : ''}</div>
          ) : null}
        </div>
        <div className="task-actions">
          <span className={`badge status-${task.status || 'pending'}`}>{task.status || 'pending'}</span>
          <button className="btn btn-secondary" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
