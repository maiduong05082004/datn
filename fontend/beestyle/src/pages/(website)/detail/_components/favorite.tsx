import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingPage from '../../loading/loadPage';

type Props = {}

const Favorite = (props: Props) => {
    const { id } = useParams()



    const [favoriteStatus, setFavoriteStatus] = useState<boolean>();

    const token = localStorage.getItem('token');

    const onSubmitFavorite = async (status: boolean) => {
        setFavoriteStatus(status);
        try {
            if (status) {
                // Thêm sản phẩm vào danh sách yêu thích
                const data = await axios.post(`http://127.0.0.1:8000/api/client/wishlist/add`, { product_id: id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(data);

            } else {
                // Xóa sản phẩm khỏi danh sách yêu thích
                await axios.delete(`http://127.0.0.1:8000/api/client/wishlist/remove/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
        }
    };

    const { data: favorite, isLoading } = useQuery({
        queryKey: ['favorite', token],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        enabled: !!token,
    });

    useEffect(() => {
        if (favorite) {
            const isFavorite = favorite?.data?.data?.some((item: any) => item?.product?.id == id);
            setFavoriteStatus(isFavorite);
        }
    }, [favorite]);

    return (
        !isLoading &&
        <button onClick={() => onSubmitFavorite(!favoriteStatus)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill={`${favoriteStatus ? "black" : "none"}`}> <g clipPath="url(#wishlist-svg)"> <path d="M15.7232 25.5459L7.37014 17.1929C5.20995 15.0327 5.20995 11.5303 7.37014 9.37014C9.53033 7.20995 13.0327 7.20995 15.1929 9.37014L15.7232 9.90047L16.2535 9.37014C18.4137 7.20995 21.9161 7.20995 24.0763 9.37014C26.2365 11.5303 26.2365 15.0327 24.0763 17.1929L15.7232 25.5459Z" stroke="black" strokeWidth="1.5" strokeLinecap="round"></path> </g> <defs> <clipPath id="wishlist-svg"> <rect width="32" height="32" fill="white"></rect> </clipPath> </defs> </svg>
        </button>
    )
}

export default Favorite