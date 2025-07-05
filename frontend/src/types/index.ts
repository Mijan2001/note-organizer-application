export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface Category {
    _id: string;
    id: string;
    name: string;
    count?: number;
    color?: string;
}

export interface Note {
    _id?: string;
    id?: string;
    title: string;
    content: string;
    category: {
        _id?: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    author: string;
    tags?: string[];
    imageUrl?: string;
    user: User;
}

export interface NoteFormData {
    title: string;
    content: string;
    category: {
        _id?: string;
        name: string;
    };
    author: string;
    tags: string[];
    imageUrl: string;
    user: string; // user ID
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
