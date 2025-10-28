import React, { useState } from "react";
// Asegúrate de que la ruta de tu logo sea correcta
import logo from "../../../../assets/ChatGPT Image Aug 27, 2025, 04_54_05 PM.png"; 

const Header = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return now.toLocaleDateString('es-ES', options);
  });

  return (
    <div className="bg-green-900 text-white p-6 shadow-lg flex justify-between items-center">
      
      <div className="flex flex-col flex-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Terra Padel Club
        </h1>
        <p className="text-lg mt-1 text-green-100">
          Dashboard
        </p>
      </div>

      <div className="flex-1 flex justify-center">
        <img 
          src={logo} 
          alt="Logo Terra Padel Club" 
          className="relative h-20 w-auto" 
        />
      </div>
      <div className="flex flex-col flex-1 items-end text-right">
        <p className="text-md capitalize text-green-100 mt-1">
          {currentDate}
        </p>
      </div>

    </div>
  );
}

export default Header;