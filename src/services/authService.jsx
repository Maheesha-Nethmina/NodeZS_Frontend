import axios from 'axios';

// 1. Define the Base URL to match your Spring Boot configuration
// This makes it easy to add /task or /dashboard features later.
const BASE_URL = "http://localhost:8080/api/v1";

/**
 * Sends user details to the backend to create a new account.
 * Requirement: Use Axios for API calls[cite: 22].
 */
export const register = async (name, email, password) => {
    try {
        // Points to @RequestMapping("api/v1/user") and @PostMapping("/save")
        const response = await axios.post(`${BASE_URL}/user/save`, { 
            name, 
            email, 
            password 
        });
        return response.data;
    } catch (error) {
        // User-visible error messages are a project requirement[cite: 43].
        throw error.response ? error.response.data : new Error("Server connection failed");
    }
};

/**
 * Authenticates user credentials.
 * Note: Core features do not require auth, but this prepares for the JWT bonus[cite: 37, 80].
 */
export const login = async (email, password) => {
    try {
        // Currently, you need to implement a /login endpoint in Spring Boot to use this.
        // For now, we point to a logical auth path.
        const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
        
        if (response.data && response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Login failed");
    }
};

/**
 * Ends the session by clearing local storage.
 */
export const logout = () => {
    localStorage.removeItem("user");
};

/**
 * Helper to retrieve the current session data.
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};