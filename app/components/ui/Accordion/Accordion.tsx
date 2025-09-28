import { useRef, useState, ReactNode, useEffect } from 'react';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  maxContentHeight?: number;
  titleClasses?: string;
  renderIcon?: (isOpen: boolean) => ReactNode;
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  renderIcon,
  className,
  maxContentHeight,
  titleClasses
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<string | number>(defaultOpen ? 'auto' : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const scrollHeight = contentRef.current.scrollHeight;
    const targetHeight = maxContentHeight ? Math.min(scrollHeight, maxContentHeight) : scrollHeight;

    if (isOpen) {
      setHeight(targetHeight);
      const timeout = setTimeout(() => setHeight('auto'), 300);
      return () => clearTimeout(timeout);
    } else {
      if (scrollHeight !== 0) {
        setHeight(targetHeight);
        requestAnimationFrame(() => setHeight(0));
      }
    }
  }, [isOpen, maxContentHeight]);


  return (
    <div className={`gradient-border-input-newzs ${className}`}>
      <button
        className="cursor-pointer w-full text-left flex justify-between items-center py-2 pr-3"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={`text-[16px] md:text-[18px] text-primary outfit font-normal  ${titleClasses}`}>{title}</span>
        <span>{renderIcon ? renderIcon(isOpen) : isOpen ? '-' : '+'}</span>
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight: typeof height === 'number' ? `${height}px` : height }}
        className="overflow-y-clip transition-[max-height] pt-4 duration-300 ease-in-out"
      >
        <div className="pb-7 spaceadjust">{children}</div>
      </div>

    </div>
  );
}
