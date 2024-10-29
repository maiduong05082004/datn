import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const NavigationButton = (props: Props) => {
  return (
    <Link to={`/`} className='text-[16px] font-[500] border-[1px] px-[32px] py-[12px] hover:text-[#BB9244] rounded-[4px]'>Tiếp tục mua hàng</Link>
  )
}

export default NavigationButton