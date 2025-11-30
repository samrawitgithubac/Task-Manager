import React, { useState, useEffect } from "react";

export default function TaskForm({ initial = {}, onCancel, onSubmit }) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [status, setStatus] = useState(initial.status || "pending");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    setTitle(initial.title || "");
    setDescription(initial.description || "");
    setStatus(initial.status || "pending");
    // initialize due_date as datetime-local string (YYYY-MM-DDTHH:MM)
    if (initial.due_date) {
      const d = new Date(initial.due_date);
      // local datetime without seconds
      const pad = (n) => String(n).padStart(2, "0");
      const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setDueDate(local);
    } else {
      setDueDate("");
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // convert dueDate (datetime-local) to a backend-friendly format (YYYY-MM-DD HH:MM:SS)
    let due = null;
    if (dueDate) {
      due = dueDate.replace("T", " ") + ":00";
    }
    onSubmit({ title, description, status, due_date: due });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form simple-box compact">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" />
      </div>
      <div className="form-group">
        <label htmlFor="due_date">Due Date</label>
        <input
          id="due_date"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
