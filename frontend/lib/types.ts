
export interface Category {
    id: string;
    name: string;
    createdAt?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    imageUrl: string | null;
    isActive: boolean;
    categoryId: string;
    category?: Category;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

export interface Order {
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}
