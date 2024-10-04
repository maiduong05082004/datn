import React, { useState } from 'react';

type Props = {};

const VariantProduct = (props: Props) => {
  const [selectedVariantGroup, setSelectedVariantGroup] = useState('Biến thể cho quần áo');
  const [selectedVariant, setSelectedVariant] = useState('Xanh lá cây');
  const [sizes, setSizes] = useState({
    S: { quantity: '', discount: '', enabled: false },
    M: { quantity: '', discount: '', enabled: false },
    L: { quantity: '', discount: '', enabled: false },
    XL: { quantity: '', discount: '', enabled: false },
    XXL: { quantity: '', discount: '', enabled: false },
  });

  const handleSizeChange = (size: string, field: string, value: string | boolean) => {
    if ((field === 'quantity' || field === 'discount') && isNaN(Number(value))) {
      return; // Prevent invalid input
    }
    setSizes((prevSizes: any) => ({
      ...prevSizes,
      [size]: {
        ...prevSizes[size],
        [field]: value,
      },
    }));
  };

  const removeSize = (size: string) => {
    setSizes((prevSizes: any) => ({
      ...prevSizes,
      [size]: { ...prevSizes[size], enabled: false, quantity: '', discount: '' },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to post product data to API
    console.log({ selectedVariantGroup, selectedVariant, sizes });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Biến thể sản phẩm</h2>

      {/* Select Variant Group */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium">Chọn nhóm biến thể:</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={selectedVariantGroup}
          onChange={(e) => setSelectedVariantGroup(e.target.value)}
        >
          <option value="Biến thể cho quần áo">Biến thể cho quần áo</option>
          {/* Add more groups if needed */}
        </select>
      </div>

      {/* Select Product Variant */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium">Chọn biến thể:</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={selectedVariant}
          onChange={(e) => setSelectedVariant(e.target.value)}
        >
          <option value="Xanh lá cây">Xanh lá cây</option>
          <option value="Xanh Nước biển">Xanh Nước biển</option>
        </select>
      </div>

      {/* Size and Quantity */}
      {Object.keys(sizes).map((size) => (
        <div key={size} className="grid grid-cols-12 gap-4 items-center mb-4">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={sizes[size as keyof typeof sizes].enabled}
              onChange={(e) =>
                handleSizeChange(size as keyof typeof sizes, 'enabled', e.target.checked)
              }
              className="mr-2"
            />
          </div>
          <label className="col-span-1 font-medium">{size}</label>
          <input
            type="number"
            className="col-span-3 p-2 border border-gray-300 rounded-lg"
            placeholder="Số lượng"
            value={sizes[size as keyof typeof sizes].quantity}
            disabled={!sizes[size as keyof typeof sizes].enabled}
            onChange={(e) =>
              handleSizeChange(size as keyof typeof sizes, 'quantity', e.target.value)
            }
          />
          <input
            type="number"
            className="col-span-3 p-2 border border-gray-300 rounded-lg"
            placeholder="Giảm giá (%)"
            value={sizes[size as keyof typeof sizes].discount}
            disabled={!sizes[size as keyof typeof sizes].enabled}
            onChange={(e) =>
              handleSizeChange(size as keyof typeof sizes, 'discount', e.target.value)
            }
          />
          <button
            className="col-span-2 p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
            onClick={() => removeSize(size)}
            disabled={!sizes[size as keyof typeof sizes].enabled}
          >
            X
          </button>
        </div>
      ))}

      {/* Image Upload Section */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Hình ảnh đại diện cho {selectedVariant}:
        </label>
        <input
          type="file"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Album hình ảnh cho {selectedVariant}:
        </label>
        <input
          type="file"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          multiple
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Hình ảnh màu cho {selectedVariant}:
        </label>
        <input
          type="file"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
      </div>

      <button type="submit" className="mt-4 p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
        Đăng sản phẩm
      </button>
    </form>
  );
};

export default VariantProduct;
