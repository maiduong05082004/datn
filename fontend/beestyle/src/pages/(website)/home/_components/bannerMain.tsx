import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import LoadingPage from '../../loading/loadPage';

type Props = {}

const BannerMain = (props: Props) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const { data: banner, isLoading } = useQuery({
        queryKey: ["banner"],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/home/bannermain`)
        }
    })

    // // Tự động chuyển banner sau 3 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === banner?.data?.banner_main.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Chuyển sau mỗi 3 giây
        return () => clearInterval(interval); // Dọn dẹp bộ đếm thời gian
    }, [banner?.data?.banner_main.length]);

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === banner?.data?.banner_main.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? banner?.data?.banner_main.length - 1 : prevIndex - 1
        );
    };

    if (isLoading) return <LoadingPage />

    return (
        !isLoading &&
        <section>
            <div className="relative">
                {banner?.data?.banner_main.map((item: any, index: any) => (
                    <div key={index + 1} className={`${index === currentIndex ? "" : "hidden"}`}>
                        <picture className=''>
                            <div className="pt-[33%] bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${item})` }}></div>
                            {/* <img className='h-full w-full hidden lg:block' src={item} alt="" /> */}
                        </picture>
                    </div>
                ))}
                <button
                    onClick={goToPrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-5 rounded-full opacity-50 hidden lg:flex"
                >
                    ❮
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-5 rounded-full opacity-50 hidden lg:flex"
                >
                    ❯
                </button>
            </div>
        </section>
    )
}

export default BannerMain