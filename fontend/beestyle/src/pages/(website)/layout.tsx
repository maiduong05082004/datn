
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Dispatch, SetStateAction } from 'react'
import { Outlet } from 'react-router-dom'
type Props = {
    isSearch: boolean
    // closes: boolean;
    // onClicks: () => void;
    setIsSearch: Dispatch<SetStateAction<boolean>>;
  }
const Layout = ({ isSearch ,setIsSearch}: Props) => {
    return (
        <>
            <Header isSearch={isSearch} setIsSearch={setIsSearch}/>
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
