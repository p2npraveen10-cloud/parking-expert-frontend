import React from "react";
import { BrowserRouter } from "react-router-dom";

import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";

// PrimeReact's Toast component needs its base theme CSS. Pick any prebuilt
// theme you like, or swap for a custom one later.
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Dashboard from "./pages/DashBoard";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;