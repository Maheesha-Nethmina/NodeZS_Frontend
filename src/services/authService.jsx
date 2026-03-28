import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/v1";

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/save`, { name, email, password });
        return response.data;
    } catch (error) {
        // Requirement: Informative error messages [cite: 43, 49]
        throw error.response ? error.response.data : new Error("Server connection failed");
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
        
        if (response.data && response.data.code === "00") {
            // response.data.content now includes {id, name, email}
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
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};