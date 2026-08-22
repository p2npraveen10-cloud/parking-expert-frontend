// MainLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useToast } from "../context/ToastContext";
import api from "../serviceCalls/api";

const MainLayout = ({ children, pageTitle }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {

  try {

    await api.post("auth/logout");

    toast.success(
      "Logout Successful",
      "You have been logged out safely"
    );

  } catch (error) {

    toast.error(
      "Logout Failed",
      "Please try again"
    );  
    console.log("Logout error", error);

  } finally {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  }

};

  return (
    <div className="h-screen flex bg-slate-50 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(30,58,138,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,58,138,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-24 right-1/4 w-[28rem] h-[28rem] rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header pageTitle={pageTitle} onLogout={handleLogout} />
<main className="px-6 md:px-8 py-4 flex-1 overflow-y-auto no-scrollbar">
  {children}
</main>
      </div>
    </div>
  );
};

export default MainLayout;