import clsx from 'clsx';

const GradientText = ({ 
  children, 
  className,
  from = 'from-primary-400',
  via = 'via-purple-400',
  to = 'to-pink-400',
  animate = false,
  ...props 
}) => {
  return (
    <span
      className={clsx(
        'bg-gradient-to-r bg-clip-text text-transparent',
        from,
        via,
        to,
        animate && 'animate-gradient',
        className
      )}
      style={animate ? { backgroundSize: '200% auto' } : {}}
      {...props}
    >
      {children}
    </span>
  );
};

export default GradientText;
