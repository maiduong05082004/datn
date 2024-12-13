import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import axios from "axios"

export const useReportMutations = () => {
    const queryClient = useQueryClient()
    const [messageApi, handleContext] = message.useMessage()

    const report = useMutation({
        mutationFn: async (reason: any) => {
            try {
                await axios.post(`http://127.0.0.1:8000/api/client/comment/report`, reason,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
            } catch (error) {
                throw new Error("Bạn đã báo cáo bình luận này rồi.")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Báo cáo thành công",
            })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })

    const like_plus = useMutation({
        mutationFn: async (data: any) => {
            try {
                await axios.post(`http://127.0.0.1:8000/api/client/comment/like`, data,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
            } catch (error) {
                throw new Error("Báo báo không thành công")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['comment']
            })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })


    return { report, like_plus, handleContext }
}