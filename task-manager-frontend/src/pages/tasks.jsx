import React, { useEffect, useState, useContext } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/tasks";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import { AuthContext } from "../context/AuthContext";

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
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
