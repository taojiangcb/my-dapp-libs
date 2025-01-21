import React from 'react';
export interface ButtonProps {}

const Button = (props: ButtonProps) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Click me-----
    </button>
  );
};
Button.displayName = "Button";

export { Button };
