// src/components/Modal.jsx
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({ open, onClose, title, message, type = "error" }) => {
  if (!open) return null;

  const colors = {
    error: "bg-red-500",
    warning: "bg-yellow-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl w-80 p-6 relative animate-fadeIn">
        
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className={`${colors[type]} rounded-full w-14 h-14 flex items-center justify-center text-white text-3xl`}>
            {type === "error" && "⚠"}
            {type === "warning" && "!"}
            {type === "success" && "✓"}
            {type === "info" && "ℹ"}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>

        {/* Message */}
        <p className="text-center text-gray-700">{message}</p>

        {/* Action button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
