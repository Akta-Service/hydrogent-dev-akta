export const METAL_COLOR_ORDER = ["14K White", "14K Yellow", "14K Rose", "18K White", "18K Yellow", "18K Rose", "Platinum"];

export function sortMetalColors(optionValues: any[]) {
  const isMetalColorOption = optionValues.some((optionValue: any) => {
    const value = optionValue.value || optionValue.name || optionValue.options?.['Metal Color'];
    return value && METAL_COLOR_ORDER.some(metal => 
      value.toLowerCase().includes(metal.toLowerCase().replace('k ', 'k'))
    );
  });

  if (!isMetalColorOption) {
    return optionValues;
  }

  const orderMap = new Map(METAL_COLOR_ORDER.map((metal, index) => [
    metal.toLowerCase().replace('k ', 'k'), 
    index
  ]));

  return [...optionValues].sort((a, b) => {
    const aValue = a.value || a.name || a.options?.['Metal Color'] || '';
    const bValue = b.value || b.name || b.options?.['Metal Color'] || '';
    
    const aName = aValue.toLowerCase().replace('k ', 'k');
    const bName = bValue.toLowerCase().replace('k ', 'k');
    
    const aIndex = orderMap.has(aName) ? orderMap.get(aName)! : Infinity;
    const bIndex = orderMap.has(bName) ? orderMap.get(bName)! : Infinity;
    
    return aIndex - bIndex;
  });
}