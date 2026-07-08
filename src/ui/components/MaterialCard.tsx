import React from 'react';
import { motion } from 'motion/react';

interface MaterialCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ children, className = '', onClick }) => {
  const Wrapper = onClick ? motion.button : motion.div;
  return (
    <Wrapper
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`bg-white/10 backdrop-blur-2xl border border-white/10 text-white rounded-[32px] p-6 shadow-sm ${className} ${onClick ? 'text-left w-full cursor-pointer hover:bg-opacity-80' : ''}`}
    >
      {children}
    </Wrapper>
  );
};
