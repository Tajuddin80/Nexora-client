import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./Router/Router";
import AuthProvider from "./AllContext/AuthProvider/AuthProvider";
import { ThemeProvider } from "./AllContext/ThemeProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <div className="w-[98vw] mx-auto">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
