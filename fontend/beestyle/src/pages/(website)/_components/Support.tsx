import React, { useState } from 'react'
import Loader from '../loading/loadSupport'

type Props = {}

const Support = (props: Props) => {
    const [isSupport, setSupport] = useState<boolean>(false)

    return (
        <div className="">
            <div onClick={() => setSupport(true)} className={`${isSupport ? "hidden" : ""} support fixed bottom-0 right-0 w-[100px] py-[10px] mr-[10px] rounded-t-[5px] bg-black cursor-pointer`}>
                <div className="flex items-center justify-center">
                    <div className="mr-[10px]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                    </div>
                    <span className="font-[500] text-white">Chat</span>
                </div>
                <div className="absolute bg-black text-white -top-[8px] -right-[6px] border-[1px] border-white rounded-[10px] px-[6px] text-[10px]">
                    10
                </div>
            </div>

            <div className={`${isSupport ? "" : "hidden"} support fixed w-[400px] h-[400px] bg-white right-[10px] bottom-0 rounded-t-[5px] border-[#e0e0e0] border-[2px] shadow-2xl`}>
                <div className="">
                    <div className="w-[100%] h-[50px] flex items-center px-[10px] border-b-[#e0e0e0] border-b-[2px] bg-slate-200 justify-between">
                        <div className="flex items-center">
                            <img width={40} height={40} src="https://cdn-icons-png.flaticon.com/512/1028/1028931.png" alt="" />
                            <span className="ml-[10px] font-[700]">Admin BeeStyle</span>
                        </div>
                        <div onClick={() => setSupport(false)} className="">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start p-[10px]">
                        <div className="bg-slate-200 rounded-[15px] p-[5px_10px] max-w-[250px]">
                            Tôi có thể giúp gì cho bạn?
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-end p-[10px]">
                        <div className="bg-blue-500 text-white rounded-[15px] p-[5px_10px] max-w-[250px]">
                            Tôi muốn hút thuốc...
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start p-[10px]">
                        <div className="bg-slate-200 rounded-[15px] p-[10px_10px] max-w-[250px] "><Loader /></div>
                    </div>
                    <div className="absolute w-full h-[50px] bottom-0 bg-slate-200 flex items-center px-[10px] border-t-[#e0e0e0] border-t-[2px] justify-between">
                        <div className="flex mr-[10px] w-[70px] justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </div>
                        <input className="rounded-[15px] min-h-[35px] px-[10px] w-[240px] outline-none" type="text" placeholder="Aa" />
                        <div className="ml-[10px] cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="absolute left-[-50px] top-0 grid gap-2">
                    <img className="cursor-pointer animate-pulse" width={40} height={40} src="https://haiauint.vn/wp-content/uploads/2024/02/zalo-icon.png" alt="" />
                    <img className="cursor-pointer animate-pulse" width={40} height={40} src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Support