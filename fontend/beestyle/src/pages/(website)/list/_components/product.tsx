import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const ProductsList = ({products} : any) => {

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      if(products?.data?.length === 0) return (<div>DEO CO SAN PHAM NAO</div>)

    return (
        <div className="grid grid-cols-4 lg:grid-cols-12 lg:px-[15px] lg:gap-2 pc:px-[48px]">

            {products?.data?.products.map((item: any) => (
                <div className="mb-[30px] col-span-2 relative lg:col-span-3 lg:mb-[40px]">
                    <div className="absolute top-[16px] right-[16px]">
                        <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                            <div className="w-[24px] h-[24px]">
                                <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute flex flex-col items-start m-[6px]">
                        <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">{item?.variations[0]?.variation_values[0]?.discount} %</div>
                        <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                    </div>
                    <Link to={`/products/${item.id}`} className="">
                        <picture>
                            <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${item?.variations[0].variation_album_images[0]})` }} ></div>
                        </picture>
                    </Link>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                        <div className="">
                            <Link to={`/products/`}>
                                <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>{item.name}</h4>
                            </Link>

                            <div className={` text-[14px] font-[700]`}>

                                <span className={``}>{new Intl.NumberFormat('vi-VN').format(item.price)} VND</span>

                            </div>

                        </div>
                        <div className="flex gap-1 justify-start mt-[18px]">
                            {item.variations.map((value: any) => (
                                <React.Fragment >
                                    <input
                                        className='hidden'
                                        type="radio"
                                        id={``}
                                        name={`options-`}
                                        value="1"

                                    />
                                    <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                        <img className="w-[12px] h-[12px] rounded-[100%]" src={value.attribute_value_image_variant.image_path} alt="" />
                                    </label>
                                </React.Fragment>
                            ))}

                        </div>
                    </div>
                </div>
            ))}


        </div>
    )
}

export default ProductsList
