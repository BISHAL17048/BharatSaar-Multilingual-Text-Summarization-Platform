import axios from "axios";
import { API_BASE_URL } from "./endpoints";
// import { auth } from "../services/firebase";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to inject Firebase Auth Token dynamically
apiClient.interceptors.request.use(
    async (config) => {
        // const user = auth.currentUser;
        // if (user) {
        //     const token = await user.getIdToken();
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
