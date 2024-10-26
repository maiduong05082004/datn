import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';


export const useProductMutations = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const updateProductMutation = useMutation({
        mutationFn: async ({token , ...productData}: any) => {
            try {
                const { product_id, cartId, quantity, product_variation_value_id } = productData

                console.log(productData);
                
                // Gọi API update sản phẩm
                return await axios.put(`http://127.0.0.1:8000/api/client/cart/update/${cartId}` , { product_id, quantity, product_variation_value_id}, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Truyền token vào header
                      }
                })
            } catch (error) {
                throw new Error('Thao tác cập nhật không thành công');
            }
        },
        onSuccess: () => {
            message.open({
                type: 'success',
                content: 'Cập nhật sản phẩm thành công',
            }),
            queryClient.invalidateQueries({
                queryKey: ['carts'],
            })
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: error.message,
            });
        },
    });
    const deleteProductMutation = useMutation({
        mutationFn: async ({token, productId} : any) => {
            try {
                // Gọi API update sản phẩm
                return await axios.delete(`http://127.0.0.1:8000/api/client/cart/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Truyền token vào header
                      }
                })
                
            } catch (error) {
                throw new Error('Thao tác xóa không thành công');
            }
        },
        onSuccess: () => {
            message.open({
                type: 'success',
                content: 'Xóa sản phẩm thành công',
            }),
            queryClient.invalidateQueries({
                queryKey: ['carts']
            })
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: error.message,
            });
        },
    });



    return { contextHolder, updateProductMutation, deleteProductMutation };
};
