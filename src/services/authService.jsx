import axios from 'axios';

// Base URL for on Spring Boot backend
const API_URL = "http://localhost:8080/api/auth";

//  Sends user details and creates a new account.
export const register = async (name, email, password) => {
    return axios.post(`${API_URL}/register`, { name, email, password });
};


// Authenticates user credentials and stores the JWT token in LocalStorage.
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    // If the backend returns a token, we save the user data for session persistence
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};


//  Removes the user data from LocalStorage to end the session.
export const logout = () => {
    localStorage.removeItem("user");
};


//   Helper to get the current logged-in user data.
export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};