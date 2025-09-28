import React, { HTMLAttributes } from 'react';
import { Link } from '@remix-run/react';
import '~/styles/components/button.css';

interface GradientBorderButtonProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  to?: string;
  as?: 'button' | 'link' | 'span';
  onClick?: () => void;
  disabled?: boolean; // Added disabled prop
}

const GradientBorderButton: React.FC<GradientBorderButtonProps> = ({
  children = 'Read',
  className = '',
  to,
  as = 'button',
  onClick,
  disabled = false, // Default to false
  ...props
}) => {
  const commonClasses = `flex cursor-pointer items-center justify-center gap-1 border border-[#D1D1D1] bg-transparent text-primary font-light text-[13px] rounded-sm custom-border-button custom-border-link ${className} outfit`;

  if (as === 'link' && to) {
    return (
      <Link
        to={to}
        className={`${commonClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (as === 'span') {
    return (
      <span
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={`${commonClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      className={`${commonClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientBorderButton;