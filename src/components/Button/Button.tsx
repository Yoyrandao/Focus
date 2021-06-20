import React from 'react';

interface ButtonProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      className="w-full h-full border border-black rounded bg-green-100"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export { Button, ButtonProps };
