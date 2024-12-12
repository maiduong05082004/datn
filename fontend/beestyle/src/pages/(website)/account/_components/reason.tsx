import { useOrderViewMutations } from '@/components/hooks/useOrderViewMutations'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
    isReportTab: any,
    setReportTab: any,
    commentItem: any
}
interface TReport {
    reason: string
}

const Reason = ({ bill_id, isReason, setReason }: any) => {
    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TReport>({
        defaultValues: {
            reason: ""
        }
    })

    const reasons = [
        "Cần thay đổi phương thức thanh toán",
        "Không còn nhu cầu",
        "Chi phí giao hàng cao",
        "Có giá tốt hơn",
    ];

    const { cancelOrder, handleContext } = useOrderViewMutations()

    const onSubmit = (data: any) => {
        if (data && bill_id) {
            cancelOrder.mutate({ bill_id, ...data });
            setReason(false)
            reset()
        }
    }

    return (
        <>
            {handleContext}
            <div className={`${isReason ? "" : "hidden"} step fixed z-20 flex-col top-0`}>
                <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] min-w-[300px] max-w-[500px] max-h-[600px] w-[100%] p-[20px]">
                    <h3 className='font-[600] text-[20px] mb-[10px]'>Tại sao bạn muốn hủy?</h3>
                    <span className='text-[17px]'>Vui lòng chọn lý do hủy</span>
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        {reasons.map((reason, index) => (
                            <div key={index} className="flex justify-start items-center my-5">
                                <input
                                    {...register("reason", { required: true })}
                                    value={reason}
                                    className="w-[50px]"
                                    type="radio"
                                />
                                <label className="ml-3 text-[16px] w-[calc(100%-50px)]">{reason}</label>
                            </div>
                        ))}
                        <div className="flex mt-5 justify-end">
                            <div onClick={() => setReason(false)} className="cursor-pointer mr-5 text-black bg-slate-50 p-[10px_50px] rounded font-medium">
                                Hủy
                            </div>
                            <button type="submit" className="text-white bg-black p-[10px_50px] rounded font-medium">
                                Gửi
                            </button>
                        </div>
                    </form>
                </div>
                <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
            </div>
        </>
    )
}

export default Reason