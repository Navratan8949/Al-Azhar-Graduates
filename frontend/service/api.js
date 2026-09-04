import axios from "axios";

const getBaseUrl = () => {

    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    
    if (typeof window !== "undefined" && window.location.hostname) {
        return `http://${window.location.hostname}:8000/api/v1`;
    }
    return "http://localhost:8000/api/v1";
};

console.log('getBaseUrl', getBaseUrl())

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // Run only in browser
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token"); // adjust key if needed
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;