import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/sonner"
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { mainRoutes } from "@/routes/mainRoutes";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={createBrowserRouter(mainRoutes)} />
  </StrictMode>,
)
