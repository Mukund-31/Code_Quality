import { useRef, useEffect } from 'react';
import { cardTilt } from '../../utils/animations';

const AnimatedCard = ({ 
  children, 
  className = '',
  enableTilt = true,
  ...props 
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!enableTilt || !cardRef.current) return;

    const cleanup = cardTilt(cardRef.current);
    return cleanup;
  }, [enableTilt]);

  return (
    <div 
      ref={cardRef} 
      className={`transform-gpu ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
