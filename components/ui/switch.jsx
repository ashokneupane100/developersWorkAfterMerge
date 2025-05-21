// components/ui/switch.js
import React from "react";

export function Switch({ checked, onChange }) {
  return (
    <div
      className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
        checked ? "bg-blue-500" : ""
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
          checked ? "translate-x-4" : ""
        }`}
      ></div>
    </div>
  );
}
