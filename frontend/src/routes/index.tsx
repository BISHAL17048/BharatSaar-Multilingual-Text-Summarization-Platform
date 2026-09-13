import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import DocumentViewer from "../pages/DocumentViewer";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "document/:id",
                element: <DocumentViewer />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);
