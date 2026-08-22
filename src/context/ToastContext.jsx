import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const show = (severity, summary, detail, life = 4000) => {
    toastRef.current?.show({ severity, summary, detail, life });
  };

  const toast = {
    success: (summary, detail) => show("success", summary, detail),
    error: (summary, detail) => show("error", summary, detail, 5000),
    info: (summary, detail) => show("info", summary, detail),
    warn: (summary, detail) => show("warn", summary, detail),
  };

  return (
    <ToastContext.Provider value={toast}>
      <Toast ref={toastRef} position="bottom-right" />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
};