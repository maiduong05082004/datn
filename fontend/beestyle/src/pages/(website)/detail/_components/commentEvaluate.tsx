import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Report from './report';
import LoadingPage from '../../loading/loadPage';

type Props = {
}

const CommentEvaluate = () => {
    const [rating, setRating] = useState(3);
    const [hover, setHover] = useState(0)
    const [isReport, setReport] = useState<boolean>(false)
    const [isReportTab, setReportTab] = useState<boolean>(false)
    const [commentItem, setCommentItem] = useState<any>()

    const { id } = useParams()
    const product_id = id

    const { data: comment, isLoading } = useQuery({
        queryKey: ['comment', product_id],
        queryFn: async () => {
            return await axios.post(`http://localhost:8000/api/client/comment/list`, { product_id });
        },
    })

    if (isLoading) return (<LoadingPage />)
    return (
        !isLoading &&
        <div className="">
            <div className="mt-[48px]">
                <div className="px-[15px] pc:px-[48px]">
                    <h3 className='text-[18px] mb-[20px] font-[700]'>ĐÁNH GIÁ SẢN PHẨM</h3>
                    {comment?.data.length > 0 ? (
                        <div className="p-[15px] bg-slate-100">
                            <div className="font-[600] mb-[20px] bg-slate-50 p-[15px]">
                                <span className='text-[30px] font-[700]'>{comment?.data
                                    .map((item: any) => item.stars)
                                    .reduce((total: number, stars: number) => total + stars, 0)
                                    / (comment?.data.length || 1)}</span> trên 5
                                <div style={{ display: 'flex' }}>
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <svg key={index + 1} xmlns="http://www.w3.org/2000/svg"
                                                fill={ratingValue <= comment?.data
                                                    .map((item: any) => item.stars)
                                                    .reduce((total: number, stars: number) => total + stars, 0)
                                                    / (comment?.data.length || 1) ? "gold" : "gray"}
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="none"
                                                className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                        );
                                    })}
                                </div>
                            </div>


                            {comment?.data.map((item: any) => (
                                <div key={item.comment_id} className="flex justify-start items-start border-b-[1px] border-b-[#e8e8e8] lg:py-[20px]">
                                    <div className="overflow-hidden bg-slate-200 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center mr-[15px]">
                                        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEPEQ8PDxIQERAQEA8PEA8PEg8PDxIXFREWFhUSFRMYHCggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBAwQCB//EADoQAAIBAgMFBQYEBQUBAAAAAAABAgMRBAUhEjFBUWEiMnGBkQYTQlKh0WKxweFykqLw8RRDU4LCFf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAAAAAGLgZMXOTHZhCiu07vhFd5ldx2b1Kt0m4R+WO9+LAnsXmtKlo3tS+WOr8yIxOf1JXUEoL+aX2IgAba2JnPvylLxbt6GoAAAAAAAGYtrVNp81ozAA7sPm1aHxbS5T7X1JXCZ/CVlUTg+a1j58UVwAXqlVjJXi00+KdzZco2HxEqbvCTi+m5+KJ7AZ7GVo1UovdtLuv7ATYPMZJ7j0AAAAAAAAAAAAA8uQGWyEzTOlG8KWslo570ui5nNnGb7V6dJ9nc5LfLouhDAZnNybk223vbZgAAAAAAAAAAAAAAAAAAAAO7Ls0nRaXehxi+HWJacLio1YqUHdfVdGUg34LFSpS2oeDXCS5MC7XMnLgMbGtFSj/2XFPkdIGQAAAAAAAYZXc9zO96VN6LSb5/hO3PMw91HYj35f0rmVcDBkAAAAAAAAAAAAAAAAAAAAAAAAADfgsVKjJSj5rhJci34PExqxU4u6e/mnyZSTuyjHujPXuS0kuX4gLgDzGV0muOp6AAAAasVWUISnLdFX/Y2Nle9pMXdqitytKXjwAh8TXdSUpy3yd/DoawAAAAAAAAAABsoUJ1HaEW3x5LxfADWCaw+R/8krdIb/U7IZRRXw36yk2BWQWh5XR+ReTl9znrZJTfdco/1L6gV8Hbi8rqU9bbUecbt+aOIAAAAAAAAAAALF7O47aTpSesdY35E4ii4as6c4zW+LT+5dqFVTjGS3SSaA2AADXWqKMXJ7opt+RSK9VzlKb3ybf2LL7RV9mlsrfOSXktX/fUq4AAAAAAAAAA6MBhXVmocN8nyQG/LMudZ3d1BOzfFvkixUaUYJRikkuRmnTUUopJJJJJHoAAAAAAEZmWVKd501afLhL7MkwBTJRabTumtGjBO55grr3sVqu/1XzeRBAAAAAAAAACx+zOJ2oypvfHVeD/AHTK4duTV9itB8H2X5gXC4MbQArXtLVvUjHhGN/V/wCCIOvNp7Vaq+UmvSyOQAAAAAAAAAWLI8Ps09p756+XD7ldtfQuVKGzGMVuSS9EB6AAAAAAAAAAGJK+j46FSxlD3c5w4J6eHD6WLcQHtDTtOMvmj+TAigAAAAAAAAnbXzXkABP/AP2wV+wA2V5XlN85yf1Z4DAAAAAAAAAHqj3o/wAUfzLkUvryZcqU9qMZfMk/VAegAAAAAAAAAAIX2k/2vCf/AJJor/tDUvUjH5Y6+b/YCLAAAAAAAAAAAAAZmrNrk2vqYN2Mjs1Ki5Tl+ZpAAAAAAAAAFiyLEbVPY+KGnk936ldOjA4p0pqS3bpLmuIFsB5pTUkpRd01dHoAAAAAAAADEmldvcldlSxdb3k5T5tteG5fQls8xqS91He+++S5eJBgAAAAAAAAAAAAAHfnlPZrT/FaXqjgJ32no60587wf5r9SCAAAAAAAAAAADty3MHRdnrBvWPLqvsWSjWjUW1F3XP78inGyhXlB7UJNPoBcAQmHzx/7kb9Y7/Q7I5xRe+TX8UZIDvBxPNaK+P0jN/oaK2eU13FKT6rZX1AlCLzLNlC8KestzktVHw5si8XmdSpdX2Y/LHS/i+JxgZk7u71b39TAAAAAAAAAAAwzJ7oUtuUYL4pJfUD1/p5AuH+jhyAGnOMP7ylNcV2l4r9inl+kU3NMN7qrKPBvaj4PX8wOQAAAAAAFvt1AGyhQlUdoJt9Fu8XwJLAZO5WlV0W/ZXefi+BN0qUYLZirLkgIfDZHfWpK3OMdX5s94nI1vpSt0lqvVEwwBU6+Bqw70HbmltL1Rzl0ueZQT3pPxSYFNPdOlKXdjKXgm/yLcqUflj/Kj2BXcNk1SWs+wvV+h3VMihbsykpW3uzv5EoAKvissqU7u21H5o3aXijiLqR+OyqFTWPYnzW5+KArYNuJw0qb2ZK3J70+qZqAAAAAABK+zmH2qrk90Ffzei/Uii25Hhvd0lffPtvz3ASAFgBkifaDB+8p7aXahd9WuKJYxJAUIHfnOB91PRdid3HpzRwAAAwMxi3ZJNt6JLeywZZlap9udnPlvUf3GT5fsJVJd9rs/hX3JMAAAAAAAAAAAAAAAADViMPGonGauvquqKzj8FKjKz1i+7Ln49S1muvRjUi4S1T/ALuBTwb8ZhXSk4S8U+a5mgAAZjFt2WreiXMDtyfB+9qK/di1KX2LejjyrBe5gl8T1k+vI7QAAAAADnxuFjVg4S47uj4MpuJoSpycJLVfXqi9Mj81y9V48pruy/R9AKiSWSYP3ktuXdha1+L3nBKjJS2GntX2bcb8C2YWgqcIwXBavm+LA2gAAAAAAAAAAAAAAAAAAAAOTMsH72DXxK7g3+XmVZr/AAXQr2e4XZntrdPV9Gt/rvAjCwez+XWtVmtfgT4L5jmyXK9tqpUXYT0T+L9izRQBIyAAAAAAADDRkAc1XCRlKM2u1Hc/INWOk8yjcDnB6lCx5AAAAAAAAAAAAAAAAAAGUrgYMVcJGokpq6un6G+FOxsA8xjbT6HoAAAAAAAAAAAAAAAHiVO57AHPKLR5Oo8uCYHODY6XI8umwPIM2MAABYADKiz2qTA1hG5Uke0gNUafM2qNtxkAAAAAAAAAAAAAAAAAAAAAAAAAYMgAYZ5QAGTMQAMgAAAAAAAAAAAAAAAAAD//2Q==" alt="" />
                                    </div>
                                    <div className="w-[calc(100%-40px)]">
                                        <span className='text-[16px]'>{item.user_name}</span>
                                        <div style={{ display: 'flex' }}>
                                            {[...Array(5)].map((_, index) => {
                                                const ratingValue = index + 1;
                                                return (
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        fill={ratingValue <= item?.stars ? "gold" : "gray"}
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="none"
                                                        className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                    </svg>
                                                );
                                            })}
                                        </div>
                                        <div className="text-[16px]">
                                            <div className="text-[14px] font-[400]">{item.commentDate}</div>
                                            <div className="text-[14px] font-[400]">Phân loại hàng: Màu: <span className='font-[500]'>{item.variation_value.color}</span> - Size: <span className='font-[500]'>{item.variation_value.size}</span></div>
                                        </div>
                                        <p className='mb-[15px] mt-[6px] text-[16px] font-[500]'>{item.content}</p>
                                        {/* <div className="flex gap-2.5">
                                            <div className="w-[72px] h-[72px]">
                                                <div className="pt-[100%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(https://res.cloudinary.com/dg4yxsmhs/image/upload/v1731063847/xryrmzghnjvo3ftcqdkp.jpg)` }}></div>
                                            </div>
                                            <div className="w-[72px] h-[72px]">
                                                <div className="pt-[100%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(https://res.cloudinary.com/dg4yxsmhs/image/upload/v1731063847/zvn1vvwvue0ashste60n.jpg)` }}></div>
                                            </div>
                                        </div> */}
                                        <div className="my-[15px] flex justify-between">
                                            <div className="flex justify-center items-center select-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" className="size-5 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                </svg>
                                                <span className='text-[#787878] text-[14px] font-[500] ml-[3px]'>{item.like} {item.like < 1000 ? "" : "k"}</span>
                                            </div>
                                            <div onClick={() => { setReportTab(!isReportTab), setCommentItem(item) }} className="cursor-pointer px-[20px]">
                                                <svg width="4px" height="16px" viewBox="0 0 4 16" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs></defs><g stroke="none" strokeWidth="1" fillRule="evenodd"><g transform="translate(-1301.000000, -550.000000)" fill="#CCCCCC"><g transform="translate(155.000000, 92.000000)"><g transform="translate(40.000000, 184.000000)"><g transform="translate(0.000000, 161.000000)"><g><g transform="translate(50.000000, 2.000000)"><path d="M1058,122.2 C1056.895,122.2 1056,123.096 1056,124.2 C1056,125.306 1056.895,126.202 1058,126.202 C1059.104,126.202 1060,125.306 1060,124.2 C1060,123.096 1059.104,122.2 1058,122.2 M1058,116.6 C1056.895,116.6 1056,117.496 1056,118.6 C1056,119.706 1056.895,120.602 1058,120.602 C1059.104,120.602 1060,119.706 1060,118.6 C1060,117.496 1059.104,116.6 1058,116.6 M1058,111 C1056.895,111 1056,111.896 1056,113 C1056,114.106 1056.895,115.002 1058,115.002 C1059.104,115.002 1060,114.106 1060,113 C1060,111.896 1059.104,111 1058,111"></path></g></g></g></g></g></g></g></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>) : (
                        <div className="w-full h-[50px] bg-slate-100 flex justify-center items-center text-[16px] font-[500]">---- Chưa có đánh giá ----</div>
                    )}

                </div>
            </div>
            <Report isReportTab={isReportTab} setReportTab={setReportTab} commentItem={commentItem} />
        </div>
    )
}

export default CommentEvaluate