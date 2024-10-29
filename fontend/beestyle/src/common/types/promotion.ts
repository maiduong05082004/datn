export interface Promotion {
    id: number;
    code: string;
    description: string;
    discount_amount: number;
    discount_type: 'amount' | 'percent';
    max_discount_amount?: number | null;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    min_order_value: number | null;
    promotion_type: string;
    is_active: boolean;
    status: string;
    category_ids?: number[];
    product_ids?: number[];
}

export interface Category {
    id: number;
    name: string;
}
  
export interface Product {
    id: number;
    name: string;
}
