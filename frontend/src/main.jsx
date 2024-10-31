import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </StrictMode>
);
