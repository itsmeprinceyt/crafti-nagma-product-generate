export interface Variant {
    name: string;
    description: string;
}

export interface Option {
    option_name: string;
    option_description: string;
}

export interface Product {
    id: string;
    code: string;
    name: string;
    brief_description: string;
    description: string;
    price: number;
    category: string[];
    delivery_charges: number;
    discount_price?: number;
    stock: boolean;
    processing_time: string;
    variants: Variant[];
    custom_note?: string;
    optional_upgrade: string;
    care_instructions: string[];
    options: Option[];
    size: string;
    material: string;
    features: string[];
    is_featured: boolean;
    is_active: boolean;
    orders_count: number;
}