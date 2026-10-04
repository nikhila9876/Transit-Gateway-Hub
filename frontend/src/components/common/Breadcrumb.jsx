import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1" aria-label="Breadcrumb">
      <Link to="/dashboard" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast || !item.path ? (
              <span className="font-medium text-slate-800">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
