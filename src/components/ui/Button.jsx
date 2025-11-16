import { forwardRef } from 'react';
import clsx from 'clsx';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  magnetic = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl focus:ring-primary-500',
    secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700 hover:border-dark-600 focus:ring-dark-500',
    outline: 'bg-transparent hover:bg-dark-800/50 text-white border-2 border-primary-500 hover:border-primary-400 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-dark-800/50 text-white focus:ring-dark-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        magnetic && 'transform-gpu',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
