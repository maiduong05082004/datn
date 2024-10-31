import axiosInstance from '@/configs/axios';
import { Category, Product, Promotion } from '@/common/types/promotion';

const API_BASE_URL = '/api/admins/promotions';

export const fetchPromotions = async (): Promise<Promotion[]> => {
  const { data } = await axiosInstance.get(API_BASE_URL);
  return data.data.map((promotion: any) => ({
    ...promotion,
    categories: Array.isArray(promotion.categories) ? promotion.categories : [],
    products: Array.isArray(promotion.products) ? promotion.products : [],
  }));
};

export const createPromotion = async (promotion: Promotion): Promise<Promotion> => {
  const { data } = await axiosInstance.post(API_BASE_URL, promotion);
  return data;
};


export const updatePromotion = async (id: number, promotion: Partial<Promotion>): Promise<Promotion> => {
    const { data } = await axiosInstance.put(`${API_BASE_URL}/${id}`, promotion);
    return data;
};

export const deletePromotion = async (id: number) => {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
};

export const getPromotion = async (id: number): Promise<Promotion> => {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return {
        ...data,
        categories: Array.isArray(data.categories) ? data.categories : [],
        products: Array.isArray(data.products) ? data.products : [],
    };
};

export const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get(`http://localhost:8000/api/admins/categories`);
    return data;
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    const { data } = await axiosInstance.post(`http://localhost:8000/api/client/categories/${categoryId}`);
    return data.products;
};
