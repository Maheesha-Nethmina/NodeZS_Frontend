import axios from 'axios';

// Single base URL as requested [cite: 22]
const BASE_URL = "http://localhost:8080/api/v1";

// --- USER AUTHENTICATION & SESSION MANAGEMENT ---

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/save`, { name, email, password });
        return response.data;
    } catch (error) {
        // Requirement: Informative error messages [cite: 43, 49, 66]
        throw error.response ? error.response.data : new Error("Server connection failed");
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
        
        if (response.data && response.data.code === "00") {
            // response.data.content includes {id, name, email} [cite: 37]
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
    // Clear all session data [cite: 80]
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    try {
        // Safely parse the stored user object [cite: 67]
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

// --- TASK MANAGEMENT (Requirement 3.1) ---

/**
 * Creates a new task with title, description, priority, and due date.
 * [cite: 31]
 */
export const saveTask = async (taskData) => {
    try {
        // Requirement: Use appropriate HTTP methods (POST) [cite: 46]
        const response = await axios.post(`${BASE_URL}/task/save`, taskData);
        return response.data;
    } catch (error) {
        // Requirement: User-visible error messages 
        throw error.response ? error.response.data : new Error("Failed to save task");
    }
};

/**
 * Fetches all tasks. Sorting and filtering can be added via query params.
 * [cite: 32]
 */
export const getAllTasks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/task/getAll`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to fetch tasks");
    }
};