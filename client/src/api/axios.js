import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
});

API.interceptors.request.use((req) => {
    try {
        const userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
            const token = JSON.parse(userFromStorage).token;
            if (token) {
                req.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error('Could not parse user from localStorage:', error);
        // Optionally clear corrupted storage
        // localStorage.removeItem('user');
    }
    return req;
});

export default API;