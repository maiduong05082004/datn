export interface Promotion {
    id: number;
    code: string;
    description: string;
    start_date: string;
    end_date: string;
    discount_amount: number;
    discount_type: 'amount' | 'percent';
    max_discount_amount?: number;
    usage_limit?: number;
    min_order_value?: number;
    promotion_type: 'shipping' | 'product';
    promotion_subtype: 'first_order' | 'product_discount' | 'voucher_discount' | 'shipping';
    is_active: boolean;
    status: string;
    category_ids?: number[];
    product_ids?: number[];
    categories?: Category[];
    products?: Product[];
  }

export interface Category {
    id: number;
    name: string;
}
export interface Product {
    id: number;
    name: string;
    category_id: number;
  }