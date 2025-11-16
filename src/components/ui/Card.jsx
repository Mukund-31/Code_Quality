import { forwardRef } from 'react';
import clsx from 'clsx';

const Card = forwardRef(({ 
  children, 
  className,
  hover = true,
  gradient = false,
  ...props 
}, ref) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  
  const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
  
  const backgroundStyles = gradient
    ? 'bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700'
    : 'bg-dark-800/90 backdrop-blur-sm border border-dark-600/50';

  return (
    <div
      ref={ref}
      className={clsx(
        baseStyles,
        backgroundStyles,
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
