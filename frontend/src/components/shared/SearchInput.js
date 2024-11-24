import React from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ value, onChange, onClear, placeholder = "Search..." }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 pr-10 rounded-lg
                 bg-gray-100 dark:bg-gray-800
                 text-gray-900 dark:text-white
                 placeholder-gray-500 dark:placeholder-gray-400
                 border border-gray-200 dark:border-gray-700
                 focus:outline-none focus:ring-2 
                 focus:ring-primary-500 focus:border-transparent"
      />
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 
                 text-gray-400"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2
                   text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;