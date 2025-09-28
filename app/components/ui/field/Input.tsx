// components/Input.tsx
import React from 'react';

interface InputProps {
    label?: string;
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
}) => {
    return (
        <div className="mb-2 relative">
            {label && (
                <label htmlFor={id} className="transition-all text-[13px] outfit font-light text-[rgba(109,109,109,1)] mb-2">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="peer w-full min-h-[45px] px-4 py-2 text-[14px] outfit font-light text-black border border-[rgba(69,69,69,1)] rounded-[8px] focus:outline-none focus:[box-shadow:0px_0px_0px_2px_rgba(0,0,0,0.12)]"
            />

        </div>
    );
};

export default Input;
