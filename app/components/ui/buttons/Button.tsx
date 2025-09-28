import type React from 'react';
import { type ButtonHTMLAttributes, useRef, useEffect, useState } from 'react';
import { Link } from '@remix-run/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  className = '',
  type = 'button',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (buttonRef.current) {
        setButtonWidth(buttonRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const lineWidth = Math.min(100, buttonWidth * 0.9);

  const buttonContent = (
    <>
      <button
        ref={buttonRef}
        type={type}
        {...props}
        className={`text-center overflow-hidden border border-transparent outfit font-semibold uppercase cursor-pointer py-[12px] bg-[#09090A] text-white rounded-sm hover:shadow-none transition-colors duration-900 hover:bg-white hover:text-black hover:border hover:border-black ${className}`}
      >
        {children}
      </button>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 h-[2px] bg-[linear-gradient(90deg,rgba(253,253,254,0.01)_0%,#FDFDFE_50%,rgba(253,253,254,0.01)_100%)] transition-transform duration-900 ease-in-out group-hover:translate-x-[200%]"
        style={{
          width: lineWidth,
          left: `calc(50% - ${lineWidth / 2}px)`,
        }}
      />

      {/* Top line */}
      <div
        className="absolute top-0 h-[2px] bg-[linear-gradient(90deg,rgba(253,253,254,0.01)_0%,#FDFDFE_50%,rgba(253,253,254,0.01)_100%)] transition-transform duration-900 ease-in-out group-hover:translate-x-[-300%]"
        style={{
          width: lineWidth,
          left: `calc(50% - ${lineWidth / 2}px)`,
        }}
      />
    </>
  );

  return to ? (
    <Link
      to={to}
      className="relative block sm:inline-block group rounded-sm overflow-hidden bg-transparent shadow-[0px_0px_16.1px_0px_#FFFFFF] hover:shadow-none"
    >
      {buttonContent}
    </Link>
  ) : (
    <div className="relative footer-btn block sm:inline-block group rounded-sm overflow-hidden bg-transparent shadow-[0px_0px_16.1px_0px_#FFFFFF] hover:shadow-none w-full md:w-[auto]">
      {buttonContent}
    </div>
  );
};

export default Button;