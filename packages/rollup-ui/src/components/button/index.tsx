import React from 'react';
import styles from './styles.module.css';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary'
}) => {
  return (
    <button
      className={`${styles.button} ${
        variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'
      } text-white px-4 py-2 rounded`}
    >
      {children}
    </button>
  );
};