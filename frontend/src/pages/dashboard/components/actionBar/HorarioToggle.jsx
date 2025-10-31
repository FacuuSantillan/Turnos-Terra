import React from 'react';
import { Switch } from '@headlessui/react';

const HorarioToggle = ({ enabled, onChange, color }) => {

  const bgColor = color === 'green' 
    ? (enabled ? 'bg-green-600' : 'bg-gray-200')
    : (enabled ? 'bg-purple-600' : 'bg-gray-200');

  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${bgColor}
        relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
        focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Activar horario</span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
          pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white 
          shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  );
};

export default HorarioToggle;