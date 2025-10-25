import React from 'react';

// Este componente solo recibe props y las muestra.
// No necesita su propio estado.
const Toast = ({ message, type }) => {
  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div
      // Clases añadidas para posicionarlo como un toast real
      className={`fixed top-155 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce` }
    >
      {message}
    </div>
  );
};

export default Toast;