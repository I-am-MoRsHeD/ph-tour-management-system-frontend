import type { ComponentType } from 'react';

export type { ISendOtp, IVerifyOtp } from './auth.type';

export interface IResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T | null
};

export interface ISidebar {
    title: string;
    items: {
        title: string,
        url: string,
        component: ComponentType;
    }[]
};

export type TRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';