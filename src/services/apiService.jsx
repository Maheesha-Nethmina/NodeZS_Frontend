import axios from 'axios';

// Single base URL as requested
const BASE_URL = "http://localhost:8080/api/v1";

// --- USER AUTHENTICATION & SESSION MANAGEMENT ---

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/save`, { name, email, password });
        return response.data;
    } catch (error) {
        // Requirement: Informative error messages
        throw error.response ? error.response.data : new Error("Server connection failed");
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
        
        if (response.data && response.data.code === "00") {
            // response.data.content includes {id, name, email}
            localStorage.setItem("user", JSON.stringify(response.data.content));
            
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Login failed");
    }
};

export const logout = () => {
    // Clear all session data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    try {
        // Safely parse the stored user object
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

// --- TASK MANAGEMENT ---

/**
 * Creates a new task with title, description, priority, and due date.
 * Ensure taskData includes userId as per the critical update.
 */
export const saveTask = async (taskData) => {
    try {
        // Requirement: Use appropriate HTTP methods (POST)
        const response = await axios.post(`${BASE_URL}/task/save`, taskData);
        return response.data;
    } catch (error) {
        // Requirement: User-visible error messages
        throw error.response ? error.response.data : new Error("Failed to save task");
    }
};

/**
 * Fetches all tasks (Non-paged).
 */
export const getAllTasks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/task/getAll`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to fetch tasks");
    }
};

/**
 * NEW: Fetches tasks with pagination support.
 * Returns 10 tasks per page by default.
 */
export const getAllTasksPaged = async (page = 0, size = 10, status = '', sortBy = 'dueDate') => {
    try {
        let url = `${BASE_URL}/task/getAllPaged?page=${page}&size=${size}&sortBy=${sortBy}`;
        if (status) url += `&status=${status}`;
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to load tasks");
    }
};

/**
 * UPDATED: Update task status AND assignee email.
 * This is used when a user "Assigns" a task to themselves via the checkbox.
 */
export const updateTaskStatus = async (taskid, status, email) => {
    try {
        // Requirement 46: Use PUT for updates
        const response = await axios.put(`${BASE_URL}/task/updateStatus`, {
            taskid: taskid,
            status: status,
            assigneeEmail: email // Added email to payload to update database
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Update failed");
    }
};

/**
 * Fetches tasks assigned to a specific email with pagination.
 * powers the Selection and MyTasks pages.
 */
export const getMyTasksPaged = async (userId, page = 0, size = 10) => {
    try {
        // Updated query parameter key to userId
        const response = await axios.get(`${BASE_URL}/task/getMyTasks?userId=${userId}&page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to load tasks");
    }
};

/**
 * For update task details in edit task page.
 */
export const updateTask = async (taskData) => {
    try {
        const response = await axios.put(`${BASE_URL}/task/update`, taskData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Update failed");
    }
};

/**
 * For delete task in my task page.
 */
export const deleteTask = async (taskid) => {
    try {
        const response = await axios.delete(`${BASE_URL}/task/delete/${taskid}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Delete failed");
    }
};
//fetch assigned tasks for selection page by email
export const getAssignedTasksPaged = async (email, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}/task/getAssignedTasks?email=${email}&page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to load assigned tasks");
    }
};