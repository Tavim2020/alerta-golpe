"use client";

import { ToastContainer as ToastContainerReactToastify } from "react-toastify";

export const ToastContainer = () => {
  return (
    <ToastContainerReactToastify
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};
