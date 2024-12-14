import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const useOrderViewMutations = () => {
    const [messageApi, handleContext] = message.useMessage()
    const queryClient = useQueryClient()

    const cancelOrder = useMutation({
        mutationFn: async (data: any) => {
            try {
                await axios.post(`http://127.0.0.1:8000/api/client/products/orders/cancel/${data.bill_id}`,
                    { reason: data.reason },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    })
            } catch (error) {
                throw new Error("Vui lòng liên hệ Admin để hủy đơn hàng.")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Hủy đơn hàng thành công",
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"],
                })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })
    const evaluateOrder = useMutation({
        mutationFn: async (data: any) => {
            try {
                await axios.post(`http://127.0.0.1:8000/api/client/comment/store`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
            } catch (error) {
                throw new Error("Thao tác thất bại!!")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Đánh giá sản phẩm thành công",
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"],
                })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })

    const successOrder = useMutation({
        mutationFn: async (id: any) => {
            try {
                await axios.post(`http://127.0.0.1:8000/api/client/products/orders/confirm/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
            } catch (error) {
                throw new Error("Thao tác thất bại!!")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Cảm ơn bạn đã mua hàng.",
            }),
                queryClient.invalidateQueries({
                    queryKey: ["order"],
                })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })


    return { cancelOrder, evaluateOrder, successOrder, handleContext }
}