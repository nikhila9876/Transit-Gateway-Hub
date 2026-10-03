import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({ label, items = [], onSelect, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          {label}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              <span>{item.label || item}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
