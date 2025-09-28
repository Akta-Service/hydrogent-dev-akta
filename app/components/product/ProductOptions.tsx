'use client';
import {Link} from '@remix-run/react';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { METAL_COLOR_MAP, DIAMOND_SHAPE_IMAGES } from '~/helpers/constants';
import { sortMetalColors } from '~/helpers/metalColorSorting';

interface ProductOptionsProps {
  productOptions: any[];
  navigate: any;
}

function getMetalProperties(metalName: string) {
  const normalizedName = metalName.toLowerCase().trim();
  const karatMatch = normalizedName.match(/(\d+k)/);
  const karat = karatMatch ? karatMatch[1].toUpperCase() : '18K';

  let className = 'bg-gray-300';
  let label = 'Metal';

  for (const [metalType, {className: bgClass, label: metalLabel}] of Object.entries(METAL_COLOR_MAP)) {
    if (normalizedName.includes(metalType)) {
      className = bgClass;
      label = metalLabel;
      break;
    }
  }

  const fullName = label === 'Platinum' ? 'PT' : `${karat}`;
  return {className, label: fullName};
}

export default function ProductOptions({productOptions, navigate}: ProductOptionsProps) {
  if (
    !productOptions ||
    productOptions.length === 0 ||
    productOptions.every((option) => option.optionValues.length <= 1)
  ) {
    return null;
  }

  return (
    <>
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        const selectedValue = option.optionValues.find((v: any) => v.selected);

        return (
          <div className="product-options mt-4" key={option.name}>
            <h5 className="outfit font-light text-primary text-[16px]">
              {option.name}:{' '}
              <span className="font-semibold">{selectedValue?.name || ''}</span>
            </h5>

            {/* If option is Size → show dropdown */}
            {option.name.toLowerCase() === 'size' ? (
              <div className="mt-2 p-2">
                <select
                  className="text-primary h-[45px] w-full border border-[#454545] rounded-md p-2 text-[13px] outfit font-light focus:outline-none bg-no-repeat bg-[right_15px_center] pr-8"
                  value={selectedValue?.name || ''}
                  onChange={(e) => {
                    const chosen = option.optionValues.find(
                      (val: any) => val.name === e.target.value,
                    );
                    if (chosen && !chosen.selected) {
                      navigate(`?${chosen.variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }
                  }}
                >
                  {option.optionValues.map((value: any) => (
                    <option key={value.name} value={value.name} disabled={!value.exists}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="product-options-grid mt-2 flex flex-wrap md:gap-5 gap-1 md:p-2">
                {sortMetalColors(option.optionValues).map((value: any) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                    swatch,
                  } = value;

                  const {className, label} = getMetalProperties(name);

                  const ButtonContent = (
                    <div key={option.name + name} className="flex flex-col items-center">
                      <div
                        className={`
                          w-10 h-4 sm:w-8 sm:h-4 md:w-14 md:h-5
                          rounded-full shadow-inner ${className}
                          ring-1 ${
                            exists ? (selected ? 'ring-[#09090a]' : 'ring-transparent') : 'ring-gray-300'
                          }
                        `}
                      />
                    </div>
                  );

                  if (isDifferentProduct) {
                    return (
                      <Link
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                        className="product-options-item rounded"
                      >
                        {option.name === 'Metal Color' || option.name === 'Gold Color' ? (
                          <>
                            {ButtonContent}
                            <div className="text-[14px] mt-1 outfit text-primary">{label}</div>
                          </>
                        ) : (
                          <ProductOptionSwatch
                            swatch={swatch}
                            name={name}
                            selected={selected}
                            available={available}
                          />
                        )}
                      </Link>
                    );
                  } else {
                    return (
                      <div key={option.name + name}>
                        <button
                          type="button"
                          className="rounded-sm product-options-item"
                          disabled={!exists}
                          onClick={() => {
                            if (!selected) {
                              navigate(`?${variantUriQuery}`, {
                                replace: true,
                                preventScrollReset: true,
                              });
                            }
                          }}
                        >
                          {option.name === 'Metal Color' || option.name === 'Gold Color' ? (
                            <>
                              {ButtonContent}
                              <div
                                className={`text-[14px] uppercase mt-1 outfit ${
                                  exists && !selected
                                    ? 'text-[#555555]'
                                    : 'text-primary font-semibold'
                                }`}
                              >
                                {label}
                              </div>
                            </>
                          ) : (
                            <ProductOptionSwatch
                              swatch={swatch}
                              name={name}
                              selected={selected}
                              available={available}
                            />
                          )}
                        </button>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
  selected,
  available,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
  selected: boolean;
  available: boolean;
}) {
  type ShapeName =
    | 'Asscher'
    | 'Oval'
    | 'Cushion'
    | 'Emerald'
    | 'Princess'
    | 'Round'
    | 'Pear'
    | 'Marquise'
    | 'Heart'
    | 'Radiant';

  const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const image = (normalizedName in DIAMOND_SHAPE_IMAGES ? DIAMOND_SHAPE_IMAGES[normalizedName as ShapeName] : null);

  const commonStyles = {
    border: selected ? '1px solid #09090a' : '1px solid #fff',
    opacity: available ? 1 : 0.5,
  };

  return (
    <>
      {image ? (
        <div className="flex flex-col justify-center items-center">
          <div
            key={name}
            aria-label={normalizedName}
            className="h-[45px] w-[45px] flex justify-center rounded-full p-1 items-center"
            style={commonStyles}
          >
            <img className="w-7" src={image || '/placeholder.svg'} alt={name} />
          </div>
          <div className="text-[14px] outfit text-primary">{normalizedName}</div>
        </div>
      ) : (
        <span
          key={name}
          style={commonStyles}
          className="text-[14px] flex items-center justify-center h-[40px] w-[40px] outfit text-primary"
        >
          {normalizedName}
        </span>
      )}
    </>
  );
}