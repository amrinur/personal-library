import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/HomePage.jsx";
import List from "./routes/List.jsx";
import Dict from "./routes/Dict.jsx";
import Loginpage from "./routes/LoginPage.jsx";
import Mainlayout from "./layout/MainLayout.jsx";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/list",
        element: <List />,
      },
      {
        path: "/dict",
        element: <Dict />,
      },
      {
        path: "/loginpage",
        element: <Loginpage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
