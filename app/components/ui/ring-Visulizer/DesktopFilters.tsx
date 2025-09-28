import type React from "react"
import FilterAccordion from "~/components/filters/FilterAccordion"
import PriceFilterAccordion from "~/components/filters/PriceFilterAccordion"
import { CARAT_FILTERS, CLARITY_FILTERS, CUT_FILTERS, COLOR_FILTERS } from "~/helpers/constants"

export const DesktopFilters: React.FC = () => {
  return (
    <div className="hidden md:block w-full md:max-w-[250px] p-0">
      <PriceFilterAccordion />
      <FilterAccordion title="Carat" options={CARAT_FILTERS} />
      <FilterAccordion title="Clarity" options={CLARITY_FILTERS} />
      <FilterAccordion title="Cut" options={CUT_FILTERS} />
      <FilterAccordion title="Color" options={COLOR_FILTERS} isShapeOrColor gridCols={3} />
    </div>
  )
}