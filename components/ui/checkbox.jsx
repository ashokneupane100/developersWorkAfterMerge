// components/ui/checkbox.js
import React from "react";

export function Checkbox({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="checkbox"
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        checked={checked}
        onChange={onChange}
      />
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
    </div>
  );
}
