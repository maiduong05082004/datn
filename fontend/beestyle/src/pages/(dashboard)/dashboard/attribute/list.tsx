import { useQuery, useQueryClient } from '@tanstack/react-query'
import { message, Spin } from 'antd'
import axios from 'axios'
import React from 'react'

type Props = {}

const list = (props: Props) => {
    const querryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const { data: attribute, isLoading } = useQuery({
        queryKey: ['attribute'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/admins/attributes');
            return response.data.data;
        },
    })
    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    return (
        <div>list</div>
    )
}

export default list