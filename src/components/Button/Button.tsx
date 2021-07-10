import React from 'react';

interface ButtonProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      style={{ backgroundColor: '#D3EEDE' }}
      className="
        transition duration-300 ease-in-out hover:bg-green-200
        w-full h-full
        rounded-3xl shadow focus:outline-none"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export { Button, ButtonProps };
