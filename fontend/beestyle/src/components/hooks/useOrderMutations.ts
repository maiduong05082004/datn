import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export const useOrderMutations = () => {
    const [messageApi, handleContext] = message.useMessage()
    const queryClient = useQueryClient()
    const navigater = useNavigate()

    const orderCod = useMutation({
        mutationFn: async (order: any) => {
            try {
                await axios.post(`http://127.0.0.1:8000/api/client/products/purchase`, order, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
            } catch (error) {
                throw new Error("Mua hàng thất bại!")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Tạo đơn hàng thành công!",
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["carts"],
                }),
                setTimeout(() => {
                    navigater(`/account`)
                })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })

    const orderATM = useMutation({
        mutationFn: async (order: any) => {

            console.log(order);
            

            let status
            try {
                const { payment_method } = order
                if (payment_method == "VNPay") {
                    status = "payment"
                } else {
                    status = "checkout"
                }
                const {data} = await axios.post(`http://localhost:8000/api/client/${status}`, order, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                window.location.href = data.data
            } catch (error) {
                throw new Error("Mua hàng thất bại!")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Tạo đơn hàng thành công!",
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["carts"],
                })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })

    return { handleContext, orderCod, orderATM }
}