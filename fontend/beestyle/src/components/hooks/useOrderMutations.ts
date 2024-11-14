import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import axios from "axios"


export const useOrderMutations = () => {
    const [ messageApi, handleContext ] = message.useMessage()
    const queryClient = useQueryClient()

    const orderCod = useMutation({
        mutationFn: async (order: any) => {
            try {
                console.log(order);   
                const data = await axios.post(`http://127.0.0.1:8000/api/client/products/purchase`, order ,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                console.log(data);
                
            } catch (error) {
                throw new Error("Mua hàng thất bại!")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Mua hàng thành công!",
            })
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

    return { handleContext, orderCod }
}