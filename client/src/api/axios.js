import axios from 'axios';

// The base URL for the API will be determined by the environment.
// In production, it reads from the .env.production file that Vercel uses.
// In development, it defaults to the proxy address.
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: API_URL,
});

// We can also add an interceptor to include the auth token on every request
// This is a more robust pattern than adding it in every single Redux thunk.
API.interceptors.request.use((req) => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
        const token = JSON.parse(userFromStorage).token;
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }
    return req;
});

export default API;