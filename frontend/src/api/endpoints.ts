export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const ENDPOINTS = {
    DOCUMENTS: {
        UPLOAD_URL: "/documents/url",
        UPLOAD_FILE: "/documents/file",
        GET_ALL: "/documents",
        GET_BY_ID: (id: string) => `/documents/${id}`,
        RENAME: (id: string) => `/documents/${id}/rename`,
    },
    JOBS: {
        GET_STATUS: (id: string) => `/jobs/${id}`,
    }
};
