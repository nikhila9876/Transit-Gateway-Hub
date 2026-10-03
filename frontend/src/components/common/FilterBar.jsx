import React from 'react';

export const FilterBar = ({ options, activeFilter, onSelect }) => {
  return (
    <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200 text-xs font-medium">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const isActive = activeFilter === value;

        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`px-3 py-1.5 rounded-md transition-all ${
              isActive
                ? 'bg-white text-blue-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
