'use client';

import {useState, useCallback} from 'react';
import type {JSX} from 'react/jsx-runtime'; // Import JSX to fix the undeclared variable error

interface ShopifyFiltersProps {
  filters: {
    id: string;
    label: string;
    type: string;
    values: {
      id: string;
      label: string;
      count: number;
      input: string;
    }[];
  }[];
  handleFilterChange: (data: any) => void;
  renderChevronIcon: () => JSX.Element;
}

export default function ShopifyFilters({
  filters,
  handleFilterChange,
  renderChevronIcon,
}: ShopifyFiltersProps) {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>(
    {},
  );
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string[];
  }>({});

  const toggleSection = useCallback((filterId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  }, []);

  const handleValueSelect = useCallback(
    (
      filterId: string,
      filterLabel: string,
      valueId: string,
      valueLabel: string,
      valueInput: string,
    ) => {
      setSelectedValues((prev) => {
        const currentValues = prev[filterId] || [];
        const isSelected = currentValues.includes(valueId);

        let newValues;
        if (isSelected) {
          newValues = currentValues.filter((id) => id !== valueId);
        } else {
          newValues = [...currentValues, valueId];
        }

        // Call the parent filter change handler
        handleFilterChange({
          id: filterId,
          label: filterLabel,
          type: 'shopify_filter',
          selectedValues: newValues,
          input: valueInput,
        });

        return {
          ...prev,
          [filterId]: newValues,
        };
      });
    },
    [handleFilterChange],
  );

  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {filters.map((filter) => (
        <div key={filter.id} className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection(filter.id)}
            className="flex items-center justify-between w-full text-left py-2"
          >
            <span className="text-sm font-medium text-primary">
              {filter.label}
            </span>
            <span
              className={`transform transition-transform ${openSections[filter.id] ? 'rotate-180' : ''}`}
            >
              {renderChevronIcon()}
            </span>
          </button>

          {openSections[filter.id] && (
            <div className="mt-2 space-y-2">
              {filter.values.map((value) => (
                <label
                  key={value.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedValues[filter.id]?.includes(value.id) || false
                    }
                    onChange={() =>
                      handleValueSelect(
                        filter.id,
                        filter.label,
                        value.id,
                        value.label,
                        value.input,
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">
                    {value.label} ({value.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
