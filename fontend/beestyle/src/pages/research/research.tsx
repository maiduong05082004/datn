import React, { useState, useEffect } from 'react';

const FilterComponent: React.FC<{ selectedCategory: string }> = ({ selectedCategory }) => {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      const response = await fetch(`http://localhost:8000/api/client/categories/${selectedCategory}/filter`);
      const data = await response.json();
      setColors(data.colors);
      setSizes(data.sizes);
    };
  
    fetchFilterData();
  }, [selectedCategory]);

  return (
    <div className="filter-section">
      <h3>Bộ lọc</h3>

      {/* Màu sắc */}
      <div className="filter-group">
        <h4>Màu sắc</h4>
        <div className="colors">
          {colors.map(color => (
            <label key={color}>
              <input type="checkbox" value={color} />
              {color}
            </label>
          ))}
        </div>
      </div>

      {/* Kích thước */}
      <div className="filter-group">
        <h4>Kích thước</h4>
        <div className="sizes">
          {sizes.map(size => (
            <label key={size}>
              <input type="checkbox" value={size} />
              {size}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
