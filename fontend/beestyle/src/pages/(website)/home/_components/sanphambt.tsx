import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';

type Product = {
    id: number;
    name: string;
    product_code: string;
    price: number;
    currency: string;
    images: Record<string, string>;
    colors: string[];
    sizes: string[];
    selectedColor: string;
    selectedSize: string;
};

const Sanphambt = () => {
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [showInfo, setShowInfo] = useState(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:3000/products');
            return response.data;
        },
    });

    if (isLoading) return <div>Loading....</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            {/* Product Display */}
            <div className='w-[430px] h-auto font-sans'>
                {data?.map((product: Product) => {
                    const currentColor = selectedColor || product.selectedColor || product.colors[0];
                    const currentSize = selectedSize || product.selectedSize || product.sizes[0];
                    const currentImage = product.images[currentColor];

                    return (
                        
                        <div key={product.id} className="bg-white">
                            <div className='w-full'>
                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    className="h-[532px] object-cover mb-4"
                                />
                            </div>
                            <div className='px-5'>
                                <div className='flex mb-2'>
                                    <div>
                                        <h2 className="text-[18px] font-bold mb-2">{product.name}</h2>
                                    </div>
                                    <div className='flex h-8'>
                                        {/* Your SVG icons here */}
                                    </div>
                                </div>
                                <p className="text-[12px] font-bold mb-2">Mã sản phẩm: {product.product_code}</p>
                                <p className="text-xl text-gray-800 font-semibold mb-4 mt-4">
                                    {product.price.toLocaleString()} {product.currency}
                                </p>
                                <div className="flex space-x-2 mb-5">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border ${currentColor === color ? 'border-black' : 'border-gray-300'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <div className='flex justify-between mb-[25px]'>
                                    <div>
                                        <label>Chọn kích thước</label>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="9" viewBox="0 0 20 9" fill="none"> <rect x="0.5" y="0.5" width="19" height="8" rx="0.5" stroke="black"></rect> <rect x="3.5" y="4" width="1" height="4" fill="black"></rect> <rect x="6.5" y="6" width="1" height="2" fill="black"></rect> <rect x="12.5" y="6" width="1" height="2" fill="black"></rect> <rect x="9.5" y="4" width="1" height="4" fill="black"></rect> <rect x="15.5" y="4" width="1" height="4" fill="black"></rect> </svg>
                                        <a href="">Hướng dẫn kích thước</a>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mb-4">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-[65px] h-[37px] border rounded-2xl mr-2 ${currentSize === size ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <div className='flex items-center mb-6 mt-6'>
                                    <div className='flex items-center w-full'>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="w-[65px] h-[48px] border border-[#E8E8E8] border-r-0 flex items-center justify-center rounded-l-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M6 10H14" stroke="#D0D0D0" stroke-linecap="square" stroke-linejoin="round"></path>
                                            </svg>
                                        </button>
                                        <input
                                            type='number'
                                            min='1'
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                                            className='w-full h-[48px] text-center border-t border-b border-[#E8E8E8] focus:outline-none font-bold'
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="w-[65px] h-[48px] border border-[#E8E8E8] border-l-0 flex items-center justify-center rounded-r-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 5V15" stroke="black" stroke-linecap="square" stroke-linejoin="round"></path>
                                                <path d="M5 10H15" stroke="black" stroke-linecap="square" stroke-linejoin="round"></path>
                                            </svg>
                                        </button>
                                    </div>

                                </div>

                                <div className='w-full h-[175px] bg-[#fafafa] border border-[#dfdfdf]'>
                                    <div className='px-[10px] pt-[10px]'>
                                        <div className='px-[18px]'>
                                            <label className='text-[14px] font-bold'>MLB Chào bạn mới</label>
                                            <p className='text-[14px] font-bold mt-2'>
                                                Nhận ngay ưu đãi 5% khi đăng ký thành viên và mua đơn hàng nguyên giá đầu tiên tại website*
                                            </p>

                                            <div className='mt-2'>
                                                <label className='text-[14px] font-bold'>Nhập mã</label> : <span className='uppercase font-bold'>MLBWELCOME</span>
                                            </div>
                                            <p className='text-[14px] font-bold mt-2'>
                                                Ưu đãi không áp dụng cùng với các CTKM khác</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex px-4 overflow-x-auto'>
                                <div className='min-w-[173px] h-[50px] text-[14px] font-bold flex justify-center items-center'>
                                    <a href="">THÔNG TIN SẢN PHẨM</a>
                                </div>
                                <div className='min-w-[173px] h-[50px] text-[14px] font-bold flex justify-center items-center'>
                                    <a href="">HƯỚNG DẪN BẢO QUẢN</a>
                                </div>
                                <div className='min-w-[173px] h-[50px] text-[14px] font-bold flex justify-center items-center'>
                                    <a href="">CHÍNH SÁCH ĐỔI TRẢ</a>
                                </div>
                                <div className='min-w-[173px] h-[50px] text-[14px] font-bold flex justify-center items-center'>
                                    <a href="">TÌM TẠI CỦA HÀNG</a>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className='fixed bottom-0 w-full bg-gray-300'>
                    <div className='flex justify-center items-center'>
                        <button className='bg-[#000000] h-[56px] text-white w-[330px] text-[14px] uppercase font-bold'>
                            Thêm giỏ hàng
                        </button>
                        <button className='bg-[#b01722] h-[56px] text-white w-[330px] text-[14px] uppercase font-bold'>
                            Mua Ngay
                        </button>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Sanphambt;
