import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getTasks() {
  const res = await axios.get(`${API_BASE}/tasks`, { headers: { ...authHeader() } });
  return res.data;
}

export async function createTask(payload) {
  const res = await axios.post(`${API_BASE}/tasks`, payload, { headers: { ...authHeader(), 'Content-Type': 'application/json' } });
  return res.data;
}

export async function updateTask(id, payload) {
  const res = await axios.put(`${API_BASE}/tasks/${id}`, payload, { headers: { ...authHeader(), 'Content-Type': 'application/json' } });
  return res.data;
}

export async function deleteTask(id) {
  const res = await axios.delete(`${API_BASE}/tasks/${id}`, { headers: { ...authHeader() } });
  return res.data;
}
