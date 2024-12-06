import { joiResolver } from "@hookform/resolvers/joi"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import axios from "axios"
import Joi from "joi"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

interface TAuth {
    name: string;
    date_of_birth: Date;
    sex: string;
    phone: string;
}
const authSchema = Joi.object({
    name: Joi.string().min(5).max(50).required().messages({
        'any.required': 'Tên người nhận là bắt buộc',
        'string.empty': 'Tên không được để trống',
        'string.min': 'Tên người nhận phải có ít nhất 5 ký tự',
        'string.max': 'Tên người nhận không được quá 50 ký tự',
    }),
    date_of_birth: Joi.date()
        .less(new Date()) // Current date
        .greater(new Date(new Date().setFullYear(new Date().getFullYear() - 100))) // 100 years ago
        .required()
        .messages({
            'date.base': 'Ngày sinh không hợp lệ',
            'date.less': 'Ngày sinh không được ở tương lai',
            'date.greater': 'Ngày sinh không hợp lệ',
            'any.required': 'Ngày sinh là bắt buộc',
        }),
    sex: Joi.string().required().messages({
        'string.empty': 'Giới tính là bắt buộc',
        'any.required': 'Ngày sinh là bắt buộc'
    }),
    phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ (10-11 chữ số)',
        'string.empty': 'Số điện thoại không được để trống',
        'any.required': 'Số điện thoại là bắt buộc',
    })
}).options({ stripUnknown: true });

const UpdateInfo = ({ user, isInfo, setInfo }: any) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TAuth>({
        resolver: joiResolver(authSchema),
    })
    const [messageApi, handleContext] = message.useMessage()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (user) {
            reset(user.data.user)
        }
    }, [user, reset])

    const { mutate } = useMutation({
        mutationFn: async (data: any) => {
            try {
                console.log(data);
                await axios.put(`http://localhost:8000/api/client/auth/update`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
            } catch (error) {
                throw new Error(`Thao tác thất bại`)
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Cập nhật thông tin thành công",
            })
            queryClient.invalidateQueries({
                queryKey: ["user"]
            }
            )
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })

    const onSubmit = (data: any) => {
        mutate(data)
        setInfo(false)
    }
    return (
        <>
            {handleContext}
            <div className={`${isInfo ? "" : "hidden"} step fixed z-20 flex-col top-0`}>
                <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] min-w-[300px] max-w-[500px] max-h-[600px] w-[100%] p-[20px]">
                    <h3 className='font-[600] text-[20px] mb-[10px]'>Cập Nhật Thông Tin</h3>
                    <form onSubmit={handleSubmit(onSubmit)} action="">
                        <div className="">
                            <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                                <label className='mb-[8px] font-[500]' htmlFor="">Họ và Tên</label>
                                <input {...register("name", { required: true })} className=' border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]' type="text" placeholder='Họ và tên' />
                                {errors.name && (<span className='italic text-red-500 text-[12px]'>{errors.name.message}</span>)}
                            </div>
                            <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                                <label className='mb-[8px] font-[500]' htmlFor="">Số điện thoại</label>
                                <input {...register("phone", { required: true })} className=' border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]' type="text" placeholder='Số điện thoại' />
                                {errors.phone && (<span className='italic text-red-500 text-[12px]'>{errors.phone.message}</span>)}
                            </div>
                            <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                                <label className='mb-[8px] font-[500]' htmlFor="">Ngày sinh</label>
                                <input {...register("date_of_birth", { required: true })} className=' border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px] font-[600]' type="date" />
                                {errors.date_of_birth && (<span className='italic text-red-500 text-[12px]'>{errors.date_of_birth.message}</span>)}
                            </div>
                            <div className="flex mt-[20px]">
                                <div className="flex items-center">
                                    <input {...register("sex", { required: true })} value='male' type="radio" name="sex" />
                                    <label className='ml-[5px]' htmlFor="">Nam</label>
                                </div>
                                <div className="flex items-center ml-[20px]">
                                    <input {...register("sex", { required: true })} value='female' type="radio" name="sex" />
                                    <label className='ml-[5px]' htmlFor="">Nữ</label>
                                </div>
                                {errors.sex && (<span className='italic text-red-500 text-[12px]'>{errors.sex.message}</span>)}
                            </div>

                            <div className="flex flex-col w-[100%] text-[16px] mt-[24px]">
                                <button type='submit' className='px-[32px] py-[12px] bg-black text-white rounded-[4px]'>CẬP NHẬT</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
            </div>
        </>
    )
}

export default UpdateInfo