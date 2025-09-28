/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {Image} from '@shopify/hydrogen';
import QuestionMark from '~/assets/images/svg/tool.svg';


function Input({
  type = 'text',
  value,
  onChange,
  min,
  max,
  step,
  className = '',
  ...props
}: {
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${className}`}
      {...props}
    />
  );
}

function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[300px] p-3 font-light outfit text-[13px] leading-[15px] text-primary bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
}
function Button({
  children,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline';
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) {
  const baseClasses =
    'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    default: 'bg-blue-600 text-primary hover:bg-blue-700 focus:ring-blue-500',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface FilterOption {
  value: string;
  label: string;
}

interface NumericRangeConfig {
  min: number;
  max: number;
  step: number;
  decimals?: number;
  suffix?: string;
}

interface CategoricalFilterData {
  type: 'categorical';
  label: string;
  selectedOptions: FilterOption[];
  range: [number, number];
  minValue: string;
  maxValue: string;
  allSelectedValues: string[];
  allSelectedLabels: string[];
}

interface NumericFilterData {
  type: 'numeric';
  label: string;
  range: [number, number];
  minValue: number;
  maxValue: number;
  config: NumericRangeConfig;
}

type FilterData = CategoricalFilterData | NumericFilterData;

interface NumericRangeConfig {
  min: number;
  max: number;
  step: number;
  decimals?: number;
  suffix?: string;
  jump?: boolean;
}

function NumericRangeSlider({
  label,
  config,
  selectedRange,
  onChange,
  tooltip,
}: {
  label: string;
  config: NumericRangeConfig;
  selectedRange: [number, number];
  onChange: (range: [number, number]) => void;
  tooltip?: string;
}) {

   // Format value for input field display
  const formatValueForInput = (value: number, label: string, decimals: number) => {
    if (label === "Price") {
      return `$${value.toLocaleString()}`;
    } else if (label === "Carat") {
      return `${value.toFixed(decimals)} ct`;
    }
    return value.toString();
  };

  const { min, max, step, decimals = 2, suffix = '', jump } = config;

  const [minValue, maxValue] = selectedRange;
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [inputMinValue, setInputMinValue] = useState(formatValueForInput(minValue, label, decimals));
  const [inputMaxValue, setInputMaxValue] = useState(formatValueForInput(maxValue, label, decimals));
  const sliderRef = useRef<HTMLDivElement>(null);

 

  // Update input values when selectedRange changes
  useEffect(() => {
    setInputMinValue(formatValueForInput(minValue, label, decimals));
    setInputMaxValue(formatValueForInput(maxValue, label, decimals));
  }, [minValue, maxValue, label, decimals]);

  // Generate evenly spaced marks
  const markCount = 6;
  const scaleMarks = Array.from({ length: markCount }, (_, i) =>
    Number((min + (i * (max - min)) / (markCount - 1)).toFixed(decimals))
  );

  const activeJumpValues = jump ? scaleMarks : null;

  const snapToJump = (val: number) => {
    if (!activeJumpValues) return val;
    return activeJumpValues.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
  };

  // const formatValueForDisplay = (value: number) => {
  //   if (label === "Price") {
  //     return `$${value.toLocaleString()}`;
  //   } else if (label === "Carat") {
  //     return `${value.toFixed(decimals)} ct`;
  //   }

  //   let formatted = value.toFixed(decimals ?? 0);
  //   if (value >= 1000) {
  //     formatted = (value / 1000).toFixed(0);
  //   }
  //   return `${formatted}${suffix ?? ''}`;
  // };

  const getLabelForValue = (value: number) => {
    if (label === "Price") {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k`;
      }
      return `${value.toFixed(decimals ?? 0)}`;
    } else if (label === "Carat") {
      return `${value.toFixed(decimals)} ct`;
    }

    let formatted = value.toFixed(decimals ?? 0);
    if (value >= 1000) {
      formatted = (value / 1000).toFixed(0);
    }
    return `${formatted}${suffix ?? ''}`;
  };

  const handleMinChange = useCallback(
    (newValue: number) => {
      const  val = jump ? snapToJump(newValue) : newValue;
      const newMin = Math.max(min, Math.min(val, max));
      let newMax = maxValue;
      if (newMin > newMax) {
        newMax = newMin;
      }
      onChange([newMin, newMax]);
    },
    [max, min, maxValue, onChange, jump]
  );

  const handleMaxChange = useCallback(
    (newValue: number) => {
      const  val = jump ? snapToJump(newValue) : newValue;
      const newMax = Math.min(max, Math.max(val, min));
      let newMin = minValue;
      if (newMax < newMin) {
        newMin = newMax;
      }
      onChange([newMin, newMax]);
    },
    [max, min, minValue, onChange, jump]
  );

  const handleInputChange = (value: string, isMin: boolean) => {
    if (isMin) {
      setInputMinValue(value);
    } else {
      setInputMaxValue(value);
    }

    // Extract numeric value from formatted string
    let numericValue: number;
    if (label === "Price") {
      // Remove $ and commas, then parse
      const cleanValue = value.replace(/[$,]/g, '');
      numericValue = Number.parseFloat(cleanValue);
    } else if (label === "Carat") {
      // Remove "ct" suffix, then parse
      const cleanValue = value.replace(/\s*ct$/i, '');
      numericValue = Number.parseFloat(cleanValue);
    } else {
      numericValue = Number.parseFloat(value);
    }

    if (!isNaN(numericValue)) {
      const snapped = jump ? snapToJump(numericValue) : numericValue;
      if (isMin) {
        if (label === "Price") {
          setInputMinValue(`$${snapped.toLocaleString()}`);
        }
        handleMinChange(snapped);
      } else {
        if (label === "Price") {
          setInputMaxValue(`$${snapped.toLocaleString()}`);
        }
        handleMaxChange(snapped);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent, handle: 'min' | 'max') => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      let newPercent = ((e.clientX - rect.left) / rect.width) * 100;
      newPercent = Math.max(0, Math.min(100, newPercent));

      const potentialValue = min + (newPercent / 100) * (max - min);
      let snappedValue = jump
        ? snapToJump(potentialValue)
        : Math.round(potentialValue / step) * step;
      snappedValue = Math.max(min, Math.min(max, snappedValue));

      let newMin = minValue;
      let newMax = maxValue;

      if (isDragging === 'min') {
        newMin = snappedValue;
        if (newMin > newMax) {
          newMax = newMin;
        }
      } else {
        newMax = snappedValue;
        if (newMax < newMin) {
          newMin = newMax;
        }
      }

      newMin = Math.max(min, Math.min(max, newMin));
      newMax = Math.max(min, Math.min(max, newMax));
      newMin = Math.min(newMin, newMax);
      newMax = Math.max(newMin, newMax);

      onChange([newMin, newMax]);
    },
    [isDragging, min, max, step, minValue, maxValue, onChange, jump]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex items-center gap-2 mb-6">
        <p className="text-[18px] outfit font-regular text-primary">{label}</p>
        {tooltip && (
          <Tooltip content={tooltip}>
            <div>
              <Image src={QuestionMark || '/placeholder.svg'} alt="" width="20px" />
            </div>
          </Tooltip>
        )}
      </div>

      {/* Slider */}
      <div className="relative mb-8" ref={sliderRef}>
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#454545] transform -translate-y-1/2" />
        <div
          className="absolute top-1/2 h-0.5 bg-transparent transform -translate-y-1/2 transition-all duration-200"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        {/* Min handle - Increased size */}
        <div
          className={`absolute w-[16px] h-[16px] z-9 bg-[#09090A] rounded-full cursor-pointer top-1/2 hover:scale-110 ${
            isDragging === 'min' ? 'scale-125 shadow-xl' : ''
          } ${isDragging ? 'transition-none' : 'transition-all duration-200'}`}
          style={{
            left: `${minPercent}%`,
            transform: 'translate(-50%, -50%)',
          }}
          
          onMouseDown={(e) => handleMouseDown(e, 'min')}
          
        />
        {/* Max handle - Increased size */}
        <div
          className={`absolute w-[16px] h-[16px] z-9 bg-[#09090A] rounded-full cursor-pointer top-1/2 hover:scale-110 ${
            isDragging === 'max' ? 'scale-125 shadow-xl' : ''
          } ${isDragging ? 'transition-none' : 'transition-all duration-200'}`}
          style={{
            left: `${maxPercent}%`,
            transform: 'translate(-100%, -50%)',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
        />

        {/* Marks */}
        <div className="relative mt-6">
          {(jump ? activeJumpValues! : scaleMarks).map((val) => {
            const pos = ((val - min) / (max - min)) * 100;
            return (
              <div
                key={`mark-${val}`}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${pos}%` }}
              >
                <span className="z-50 text-[12px] text-primary uppercase outfit font-light whitespace-nowrap">
                  {getLabelForValue(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-2 pt-12">
        <div className="outline-box">
          <Input
            type="text"
            value={inputMinValue}
            onChange={(e) => handleInputChange(e.target.value, true)}
            className="text-primary outline-none bg-no-repeat h-[45px] border border-[#D1D1D1] cursor-pointer bg-white font-light w-full text-[13px] rounded-md outfit"
          />
        </div>
        <div className="outline-box">
          <Input
            type="text"
            value={inputMaxValue}
            onChange={(e) => handleInputChange(e.target.value, false)}
            className="text-primary outline-none bg-no-repeat h-[45px] border border-[#D1D1D1] cursor-pointer bg-white font-light w-full text-[13px] rounded-md outfit"
          />
        </div>
      </div>
    </div>
  );
}

function CategoricalRangeSlider({
  label,
  options,
  selectedRange,
  onChange,
  tooltip,
}: {
  label: string;
  options: FilterOption[];
  selectedRange: [number, number];
  onChange: (range: [number, number]) => void;
  tooltip?: string;
}) {
  const [minIndex, maxIndex] = selectedRange;
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, handle: 'min' | 'max') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      let newPercent = ((clientX - rect.left) / rect.width) * 100;
      newPercent = Math.max(0, Math.min(100, newPercent)); // Clamp percentage to 0-100

      const totalOptions = options.length - 1;
      const potentialIndex = (newPercent / 100) * totalOptions;
      let snappedIndex = Math.round(potentialIndex);
      snappedIndex = Math.max(0, Math.min(totalOptions, snappedIndex)); // Clamp to overall index bounds

      let newMinIndex = minIndex;
      let newMaxIndex = maxIndex;

      if (isDragging === 'min') {
        newMinIndex = snappedIndex;
        if (newMinIndex > newMaxIndex) {
          newMaxIndex = newMinIndex;
        }
      } else {
        // isDragging === "max"
        newMaxIndex = snappedIndex;
        if (newMaxIndex < newMinIndex) {
          newMinIndex = newMaxIndex;
        }
      }

      // Ensure final range is within overall bounds and minIndex <= maxIndex
      newMinIndex = Math.max(0, Math.min(totalOptions, newMinIndex));
      newMaxIndex = Math.max(0, Math.min(totalOptions, newMaxIndex));
      newMinIndex = Math.min(newMinIndex, newMaxIndex);
      newMaxIndex = Math.max(newMinIndex, newMaxIndex);

      onChange([newMinIndex, newMaxIndex]);
    },
    [isDragging, options.length, minIndex, maxIndex, onChange],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercent =
    options.length <= 1 ? 0 : (minIndex / (options.length - 1)) * 100;
  const maxPercent =
    options.length <= 1 ? 100 : (maxIndex / (options.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <p className="text-[18px] outfit font-regular text-primary">{label}</p>
        {tooltip && (
          <Tooltip content={tooltip}>
            <div>
              <Image
                src={QuestionMark || '/placeholder.svg'}
                alt=""
                width="20px"
              />
            </div>
          </Tooltip>
        )}
      </div>
      <div className="relative mb-8" ref={sliderRef}>
        {/* Slider track */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#454545] transform -translate-y-1/2" />
        {/* Active range */}
        <div
          className="absolute top-1/2 h-0.5 bg-transparent transform -translate-y-1/2 transition-all duration-200"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        {/* Min handle - Increased size */}
        <div
          className={`absolute w-[16px] h-[16px] bg-[#09090A] rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 ${
            isDragging === 'min' ? 'scale-125 shadow-xl' : ''
          } ${isDragging ? 'transition-none' : 'transition-all duration-200'}`}
          style={{left: `${minPercent}%`}}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
        />
        {/* Max handle - Increased size */}
        <div
          className={`absolute w-[16px] h-[16px] bg-[#09090A] rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 ${
            isDragging === 'max' ? 'scale-125 shadow-xl' : ''
          } ${isDragging ? 'transition-none' : 'transition-all duration-200'}`}
          style={{left: `${maxPercent}%`}}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
        />
        {/* Option labels - Fixed alignment */}
        <div className="relative mt-6">
          {options.map((option, index) => {
            const position =
              options.length === 1 ? 50 : (index / (options.length - 1)) * 100;
            return (
              <div
                key={`option-${index}-${option.value}`}
                className="absolute transform -translate-x-1/2"
                style={{left: `${position}%`}}
              >
                <div className="h-2" />
                <span
                  className={`text-[12px] outfit select-none transition-colors duration-200 whitespace-nowrap ${
                    index >= minIndex && index <= maxIndex
                      ? 'text-primary'
                      : 'text-primary'
                  }`}
                >
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const UniversalRangeFilter = forwardRef(function UniversalRangeFilter(
  {
    label,
    tooltip,
    type,
    options,
    numericConfig,
    defaultCategoricalRange,
    defaultNumericRange,
    onChange,
  }: {
    label: string;
    tooltip?: string;
    type: 'categorical' | 'numeric';
    options?: FilterOption[];
    numericConfig?: NumericRangeConfig;
    defaultCategoricalRange?: [number, number];
    defaultNumericRange?: [number, number];
    onChange?: (filterData: FilterData) => void;
  },
  ref,
) {
  const [categoricalRange, setCategoricalRange] = useState<[number, number]>(
    defaultCategoricalRange || [0, (options?.length || 1) - 1],
  );
  const [numericRange, setNumericRange] = useState<[number, number]>(
    defaultNumericRange || [numericConfig?.min || 0, numericConfig?.max || 100],
  );

  // Method to reset to defaults
  const reset = useCallback(() => {
    if (type === 'categorical' && defaultCategoricalRange) {
      setCategoricalRange(defaultCategoricalRange);
      if (options) {
        const selectedOptions = options.slice(
          defaultCategoricalRange[0],
          defaultCategoricalRange[1] + 1,
        );
        const filterData: CategoricalFilterData = {
          type: 'categorical',
          label,
          selectedOptions,
          range: defaultCategoricalRange,
          minValue: options[defaultCategoricalRange[0]].label,
          maxValue: options[defaultCategoricalRange[1]].label,
          allSelectedValues: selectedOptions.map((opt) => opt.value),
          allSelectedLabels: selectedOptions.map((opt) => opt.label),
        };
        onChange?.(filterData);
      }
    } else if (type === 'numeric' && defaultNumericRange) {
      setNumericRange(defaultNumericRange);
      if (numericConfig) {
        const filterData: NumericFilterData = {
          type: 'numeric',
          label,
          range: defaultNumericRange,
          minValue: defaultNumericRange[0],
          maxValue: defaultNumericRange[1],
          config: numericConfig,
        };
        onChange?.(filterData);
      }
    }
  }, [
    type,
    defaultCategoricalRange,
    defaultNumericRange,
    options,
    numericConfig,
    onChange,
    label,
  ]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    reset,
  }));

  const handleCategoricalChange = (range: [number, number]) => {
    setCategoricalRange(range);
    if (options) {
      const selectedOptions = options.slice(range[0], range[1] + 1);
      const filterData: CategoricalFilterData = {
        type: 'categorical',
        label,
        selectedOptions,
        range,
        minValue: options[range[0]].label,
        maxValue: options[range[1]].label,
        allSelectedValues: selectedOptions.map((opt) => opt.value),
        allSelectedLabels: selectedOptions.map((opt) => opt.label),
      };
      onChange?.(filterData);
    }
  };

  const handleNumericChange = (range: [number, number]) => {
    setNumericRange(range);
    if (numericConfig) {
      const filterData: NumericFilterData = {
        type: 'numeric',
        label,
        range,
        minValue: range[0],
        maxValue: range[1],
        config: numericConfig,
      };
      onChange?.(filterData);
    }
  };

  return (
    <div className="w-full">
      {type === 'categorical' && options ? (
        <CategoricalRangeSlider
          label={label}
          options={options}
          selectedRange={categoricalRange}
          onChange={handleCategoricalChange}
          tooltip={tooltip}
        />
      ) : type === 'numeric' && numericConfig ? (
        <NumericRangeSlider
          label={label}
          config={numericConfig}
          selectedRange={numericRange}
          onChange={handleNumericChange}
          tooltip={tooltip}
        />
      ) : null}
    </div>
  );
});

export default UniversalRangeFilter;