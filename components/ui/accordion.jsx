import React, { useState } from "react";

function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg">
      <button
        className="w-full text-left px-4 py-2 bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && <div className="px-4 py-2">{children}</div>}
    </div>
  );
}

export default Accordion;
