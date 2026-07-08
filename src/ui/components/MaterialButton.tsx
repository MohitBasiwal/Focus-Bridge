import React from 'react';
import { motion } from 'motion/react';

interface MaterialButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  icon?: React.ReactNode;
  className?: string;
}

export const MaterialButton: React.FC<MaterialButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'filled',
  icon,
  className = '' 
}) => {
  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors text-sm tracking-wide";
  
  const variants = {
    filled: "bg-[#005cbb] text-white dark:bg-[#8bc1ff] dark:text-[#001945] hover:opacity-90",
    tonal: "bg-[#d6e3ff] text-[#001b3d] dark:bg-[#004b98] dark:text-[#d6e3ff] hover:opacity-90",
    outlined: "border border-[#74777f] text-[#005cbb] dark:text-[#8bc1ff] hover:bg-[#005cbb]/10",
    text: "text-[#005cbb] dark:text-[#8bc1ff] hover:bg-[#005cbb]/10"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </motion.button>
  );
};
