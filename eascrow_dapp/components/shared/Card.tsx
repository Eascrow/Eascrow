import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`border border-[#34455C] py-4 px-6 shadow-[inset_0_0_80px_rgba(52,69,92,0.25)] rounded-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
