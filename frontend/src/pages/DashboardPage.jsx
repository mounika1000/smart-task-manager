import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { clearAuth, getUser } from "../utils/auth";

const defaultTask = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
};

function DashboardPage({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const user = getUser();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [formData, setFormData] = useState(defaultTask);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setError("");
      const params = {};
      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }
      params.page = page;
      params.size = size;
      const response = await axiosClient.get("/tasks", { params });
      setFilteredTasks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        handleLogout();
      } else {
        setError("Failed to load tasks.");
      }
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get("/tasks/stats");
      setStats(response.data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        handleLogout();
      } else {
        setError("Failed to load dashboard stats.");
      }
    }
  };

  const searchTasks = async (keyword) => {
    try {
      setError("");
      if (!keyword.trim()) {
        fetchTasks();
        return;
      }

      const response = await axiosClient.get("/tasks/search", {
        params: { keyword: keyword.trim() },
      });

      // Keep search results in a separate state and apply local status filter on top.
      const searched = response.data;
      if (statusFilter === "ALL") {
        setFilteredTasks(searched);
      } else {
        setFilteredTasks(searched.filter((task) => task.status === statusFilter));
      }
      // Search endpoint is not paginated; show a single logical page.
      setPage(0);
      setTotalPages(1);
      setTotalElements(searched.length);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        handleLogout();
      } else {
        setError("Failed to search tasks.");
      }
    }
  };

  useEffect(() => {
    if (searchKeyword.trim()) {
      return;
    }
    fetchTasks();
  }, [statusFilter, page, size, searchKeyword]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTasks(searchKeyword);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosClient.post("/tasks", formData);
      setFormData(defaultTask);
      setPage(0);
      fetchStats();
      if (searchKeyword.trim()) {
        searchTasks(searchKeyword);
      } else {
        fetchTasks();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (task) => {
    const updatedStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      await axiosClient.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: updatedStatus,
        priority: task.priority,
        dueDate: task.dueDate || null,
      });
      fetchStats();
      if (searchKeyword.trim()) {
        searchTasks(searchKeyword);
      } else {
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      fetchStats();
      if (searchKeyword.trim()) {
        searchTasks(searchKeyword);
      } else {
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  return (
    <div className="page-wrap dashboard">
      <div className="card full-width">
        <div className="topbar">
          <div>
            <h2>Task Dashboard</h2>
            <p className="helper-text">
              Welcome, {user?.name || "User"} ({user?.email || "no-email"})
            </p>
          </div>
          <div className="header-actions">
            <button type="button" className="theme-btn" onClick={onToggleTheme}>
              {theme === "light" ? "Dark" : "Light"} Mode
            </button>
            <button onClick={handleLogout} className="secondary-btn">
              Logout
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="helper-text">Total Tasks</p>
            <h3>{stats.totalTasks}</h3>
          </div>
          <div className="stat-card">
            <p className="helper-text">Completed</p>
            <h3 className="status-done">{stats.completedTasks}</h3>
          </div>
          <div className="stat-card">
            <p className="helper-text">Pending</p>
            <h3 className="status-pending">{stats.pendingTasks}</h3>
          </div>
        </div>

        <form onSubmit={handleAddTask} className="task-form">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          />

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <label>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="filter-row">
          <div className="filter-control">
            <label htmlFor="statusFilter">Filter by status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(0);
              }}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="filter-control">
            <label htmlFor="searchKeyword">Search by title</label>
            <input
              id="searchKeyword"
              type="text"
              placeholder="Type task title..."
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
          </div>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="helper-text">No tasks yet. Add your first task.</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Due Date: {task.dueDate || "Not set"}</p>
                <p>
                  Priority:{" "}
                  <strong
                    className={
                      task.priority === "HIGH"
                        ? "priority-high"
                        : task.priority === "MEDIUM"
                          ? "priority-medium"
                          : "priority-low"
                    }
                  >
                    {task.priority}
                  </strong>
                </p>
                <p>
                  Status:{" "}
                  <strong
                    className={
                      task.status === "COMPLETED" ? "status-done" : "status-pending"
                    }
                  >
                    {task.status}
                  </strong>
                </p>
                <div className="task-actions">
                  <button type="button" onClick={() => toggleStatus(task)}>
                    Mark as {task.status === "COMPLETED" ? "Pending" : "Completed"}
                  </button>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!searchKeyword.trim() && (
          <div className="pagination-row">
            <button
              type="button"
              className="secondary-btn"
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              Previous
            </button>
            <p className="helper-text">
              Page {totalPages === 0 ? 0 : page + 1} of {totalPages} | Total tasks:{" "}
              {totalElements}
            </p>
            <button
              type="button"
              className="secondary-btn"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
