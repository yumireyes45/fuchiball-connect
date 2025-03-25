
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const CustomButton = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: CustomButtonProps) => {
  const variantClasses = {
    primary: 'premium-button-primary',
    secondary: 'premium-button-secondary',
    accent: 'premium-button-accent',
    outline: 'premium-button border-2 border-fuchiball-green text-fuchiball-green hover:bg-fuchiball-green/10',
  };

  const sizeClasses = {
    sm: 'text-sm px-4 py-2 rounded-lg',
    md: 'px-6 py-3 rounded-xl',
    lg: 'text-lg px-8 py-4 rounded-xl',
  };

  return (
    <button
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        loading ? 'opacity-70 cursor-not-allowed' : '',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          <span>Cargando...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          {icon && iconPosition === 'left' && icon}
          <span>{children}</span>
          {icon && iconPosition === 'right' && icon}
        </div>
      )}
    </button>
  );
};

export default CustomButton;
