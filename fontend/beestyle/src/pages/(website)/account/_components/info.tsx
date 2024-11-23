import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

const InfoPage = (props: Props) => {

  const token = localStorage.getItem("token")

  const { data: user } = useQuery({
      queryKey: ['user', token],
      queryFn: () => {
          if (!token) return null;
          return axios.get(`http://127.0.0.1:8000/api/client/auth/profile` , {
              headers: { Authorization: `Bearer ${token}` }
          })
      }
  })
  
  return (
    <div className="">
      <div className="">
        <div className="text-[16px] font-[700] py-[15px] lg:text-[20px] lg:border-b-[3px] lg:border-b-black mb-[15px] lg:py-[10px]">TÀI KHOẢN ĐĂNG NHẬP</div>
        <div className="">
          <div className="flex justify-between *:text-[14px] font-[600]">
            <label htmlFor="">Tên đăng nhập</label>
            <span>{user?.data.user.email}</span>
          </div>
          <div className="flex items-center justify-center h-[45px] border-[1px] border-[#e8e8e8] rounded-[2px] font-[600] text-[16px] mt-[20px] lg:w-[200px] cursor-pointer">Đổi mật khẩu</div>
        </div>
      </div>
      <div className="mt-[20px]">
        <div className="text-[16px] font-[700] py-[15px]">TÀI KHOẢN</div>
        <div className="*:font-[500] text-[14px]">
          <div className="flex">
            <label className='w-[50%]' htmlFor="">Tên</label>
            <span className='w-[50%]'>{user?.data.user.name}</span>
          </div>
          <div className="mt-[15px] flex">
            <label className='w-[50%]' htmlFor="">Ngày sinh</label>
            <span className='w-[50%]'>{user?.data.user.date_of_birth}</span>
          </div>
          <div className="mt-[15px] flex">
            <label className='w-[50%]' htmlFor="">Giới tính</label>
            {user?.data.user.sex == "male" ? (
              <span className='w-[50%]'>Nam</span>
            ) : (
              <span className='w-[50%]'>Nữ</span>
            )}
          </div>
          <div className="mt-[15px] flex">
            <label className='w-[50%]' htmlFor="">Số điện thoại</label>
            <span className='w-[50%]'>{user?.data.user.phone}</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-[45px] bg-black text-white rounded-[2px] font-[600] text-[16px] mt-[20px] lg:w-[200px] cursor-pointer">Cập nhật thông tin</div>
      </div>

    </div>
  )
}

export default InfoPage