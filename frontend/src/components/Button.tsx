import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ElementType;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'font-bold rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-red-500/25',
    secondary:
      'bg-black/30 hover:bg-black/50 border border-red-500/50 hover:border-red-400 text-white hover:scale-105',
    ghost:
      'bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/30 hover:border-red-400/60 hover:text-red-300',
    danger:
      'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-red-600/25',
  };

  const sizes: Record<string, string> = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-4 px-8 text-base',
    lg: 'py-5 px-10 text-lg',
    xl: 'py-6 px-12 text-xl',
  };

  const iconSizes: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Optional shimmer effect for primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
      )}

      <div className="relative z-10 flex items-center justify-center">
        {Icon && (
          <Icon
            className={`${iconSizes[size]} mr-2 group-hover:scale-110 transition-transform duration-300 ${
              variant === 'primary' ? 'group-hover:rotate-12' : ''
            }`}
          />
        )}
        {children}
      </div>
    </button>
  );
};

export default Button;
