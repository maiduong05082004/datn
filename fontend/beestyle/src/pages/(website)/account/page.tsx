import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

type Props = {}

const AccountPage = (props: Props) => {

    const navigate = useNavigate()

    const token = localStorage.getItem("token")

    const { data: user, isLoading } = useQuery({
        queryKey: ['user', token],
        queryFn: () => {
            if (!token) return null;
            return axios.get(`http://127.0.0.1:8000/api/client/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }
    })
    const logout = async () => {
        try {
            await axios.post(`http://localhost:8000/api/client/auth/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.removeItem('token');
            navigate(`/signin`)
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    useEffect(() => {
        if (token && isLoading) return
        if (!user) navigate(`/signin`)
    }, [user])

    const navigate = useNavigate()

    const token = localStorage.getItem("token")

    const { data: user, isLoading } = useQuery({
        queryKey: ['user', token],
        queryFn: () => {
            if (!token) return null;
            return axios.get(`http://127.0.0.1:8000/api/client/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }
    })
    const logout = async () => {
        try {
            await axios.post(`http://localhost:8000/api/client/auth/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.removeItem('token');
            navigate(`/signin`)
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    useEffect(() => {
        if (token && isLoading) return
        if (!user) navigate(`/signin`)
    }, [user])

    return (
        <main className='px-[15px] lg:py-[64px]'>
            <div className=" lg:mx-[125px] lg:flex max-w-[1270px]">

                <div className="lg:order-2 lg:w-[80%] lg:pl-[32px] mb-[40px]">
                    <Outlet />
                </div>

                <div className="lg:order-1 lg:w-[20%]">
                    <h2 className='text-[16px] font-[700] pb-[12px] mb-[20px] border-b-[1px] border-b-black lg:border-0 lg:text-[32px] lg:mb-[15px]'>Tài khoản</h2>
                    <div className="mb-[20px]">
                        <p className='mb-[8px] text-[14px] font-[700] text-[#787878]'>Thông tin mua hàng |</p>
                        <ul>
                            <li><a className='text-[16px] font-[500]'>Thông tin thành viên</a></li>
                            <li><Link to={`/account`} className='text-[16px] font-[500]'>Thông tin đơn hàng</Link></li>
                        </ul>
                    </div>
                    <div className="mb-[20px]">
                        <p className='mb-[8px] text-[14px] font-[700] text-[#787878]'>Thông tin hoạt động |</p>
                        <ul>
                            <li><Link className='text-[16px] font-[500]' to={`/account/wishlist`}>Wishlist</Link></li>
                            <li><Link className='text-[16px] font-[500]' to={`/account/recently`}>Xem gần đây</Link></li>
                        </ul>
                    </div>
                    <div className="mb-[20px]">
                        <p className='mb-[8px] text-[14px] font-[700] text-[#787878]'>Cài đặt tài khoản |</p>
                        <ul>
                            <li><Link className='text-[16px] font-[500]' to={`/account/addresses`}>Địa chỉ giao hàng</Link></li>
                            <li><Link className='text-[16px] font-[500]' to={`/account/info`}>Thông tin của tôi</Link></li>
                            <li><a href="" className='text-[16px] font-[500]'>Xóa tài khoản</a></li>
                            <li><div onClick={logout} className='text-[16px] font-[500] cursor-pointer'>Đăng xuất</div></li>
                        </ul>

                    </div>
                </div>
            </div>


        </main>
    )
}

export default AccountPage