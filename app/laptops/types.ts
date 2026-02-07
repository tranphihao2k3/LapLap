export interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
}

export interface Product {
    _id: string;
    name: string;
    model: string;
    image: string;
    images: string[];
    price: number;
    specs: {
        cpu: string;
        gpu: string;
        ram: string;
        ssd: string;
        screen: string;
        battery: string;
    };
    warranty?: {
        duration: string;
        items: string[];
    };
    gift?: string;
    warrantyMonths?: number;
    policies?: {
        technicalSupport: boolean;
        freeShipping: boolean;
        returnPolicy: string;
    };
    categoryId?: Category;
    brandId?: Brand;
    status?: string;
}
