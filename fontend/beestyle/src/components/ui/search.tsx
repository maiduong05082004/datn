import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

interface SearchProps<T> {
  items: T[];
  onSearch: (query: string) => void;
  onSortChange?: (sortKey: string) => void;
  sortOptions?: string[];
  sortOptionsName?: string[];
}

const SearchComponent = <T,>({ 
  items, 
  onSearch, 
  onSortChange, 
  sortOptions, 
  sortOptionsName,
}: SearchProps<T>) => {
  const [query, setQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSort(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Tìm kiếm..."
          className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
          <SearchOutlined />
        </span>
      </div>

      {sortOptions && sortOptions.length > 0 && (
        <select
          className="ml-2 border border-gray-300 rounded-md p-2"
          value={selectedSort}
          onChange={handleSortChange}
        >
          <option value="">Sắp xếp theo</option>
          {sortOptions.map((option, index) => (
            <option key={option} value={option}>
              Sắp xếp {sortOptionsName && sortOptionsName[index] ? sortOptionsName[index] : `Sắp xếp ${option} theo A-Z`} theo A-Z
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchComponent;
