import React, { useEffect, useState, useContext } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/tasks";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import { AuthContext } from "../context/AuthContext";

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.role === 'admin';
  const [owners, setOwners] = useState('all'); // all | mine (admin only)
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | in-progress | completed
  const [sortBy, setSortBy] = useState('created_at'); // created_at | due_date | title | status
  const [sortOrder, setSortOrder] = useState('desc'); // asc | desc
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, owners, statusFilter, sortBy, sortOrder]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const params = {};
      // Only send owners param if admin wants to see only their own tasks
      if (isAdmin && owners === 'mine') {
        params.owners = 'mine';
      }
      // Add status filter
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      // Add sorting parameters
      params.sort_by = sortBy;
      params.sort_order = sortOrder;
      
      const data = await getTasks(params);
      console.debug('Tasks API raw response:', data);
      console.debug('Current user in Tasks page:', user);
      // normalize response to an array
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data && Array.isArray(data.data)) list = data.data;
      else if (data && Array.isArray(data.tasks)) list = data.tasks;
      else list = [];
      setTasks(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await updateTask(editing.id, payload);
      } else {
        await createTask(payload);
      }
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    }
  };

  const handleEdit = (task) => {
    setEditing(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="container">
      <h2>My Tasks</h2>
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {isAdmin && (
          <div>
            <label style={{ marginRight: 8 }}>Show:</label>
            <select value={owners} onChange={(e) => setOwners(e.target.value)} style={{ padding: '4px 8px' }}>
              <option value="all">All users' tasks</option>
              <option value="mine">My tasks only</option>
            </select>
          </div>
        )}
        
        <div>
          <label style={{ marginRight: 8 }}>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '4px 8px' }}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: 8 }}>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '4px 8px' }}>
            <option value="created_at">Created Date</option>
            <option value="due_date">Due Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: 8 }}>Order:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '4px 8px' }}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      <div style={{ marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={handleCreateClick}>New Task</button>
      </div>

      {showForm && (
        <TaskForm initial={editing || {}} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="task-list">
          {tasks.length === 0 && <div>No tasks yet.</div>}
          {tasks.map((t) => (
            <TaskItem key={t.id} task={t} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
