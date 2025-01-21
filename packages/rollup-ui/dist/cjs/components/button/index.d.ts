import React from 'react';
export interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}
export declare const Button: React.FC<ButtonProps>;
