import type {FilterOption} from './FilterAccordion';

// All filter constants have been moved to ~/helpers/constants
// Please import them from '~/helpers/constants' instead of this file

import roundedShape from '~/assets/images/demo/round.png';
import ovalShape from '~/assets/images/demo/oval.png';
import radiantShape from '~/assets/images/demo/radient.png';
import pearShape from '~/assets/images/demo/pear.png';
import cushionShape from '~/assets/images/demo/cusion.png';
import princessShape from '~/assets/images/demo/princess.png';



export interface FilterRange {
  min: number;
  max: number;
  step: number;
}

export const SHAPE_FILTERS: FilterOption[] = [
  {label: 'Round', value: 'round', image: roundedShape},
  {label: 'Oval', value: 'oval', image: ovalShape},
  {label: 'Radiant', value: 'radiant', image: radiantShape},
  {label: 'Pear', value: 'pear', image: pearShape},
  {label: 'Cushion', value: 'cushion', image: cushionShape},
  {label: 'Princess', value: 'princess', image: princessShape},
];

export const CARAT_FILTERS: FilterOption[] = [
  {label: '0.75 Carat', value: '0.75', count: 2},
  {label: '1.00 Carat', value: '1.00', count: 12},
  {label: '1.50 Carat', value: '1.50', count: 22},
  {label: '2.00 Carat', value: '2.00', count: 34},
  {label: '2.50 Carat', value: '2.50', count: 45},
  {label: '3.00 Carat', value: '3.00', count: 34},
];

export const CLARITY_FILTERS: FilterOption[] = [
  {label: 'SI1', value: 'si1', count: 2},
  {label: 'VS1', value: 'vs1', count: 12},
  {label: 'VS2', value: 'vs2', count: 22},
  {label: 'VVS2', value: 'vvs2', count: 34},
];

export const CUT_FILTERS: FilterOption[] = [
  {label: 'Excellent', value: 'excellent', count: 2},
  {label: 'Very Good', value: 'very-good', count: 12},
  {label: 'Good', value: 'good', count: 22},
  {label: 'Fair', value: 'fair', count: 34},
  {label: 'Poor', value: 'poor', count: 12},
];

export const COLOR_FILTERS: FilterOption[] = [
  {
    label: 'Yellow Gold',
    value: 'yellow-gold',
    gradient: 'linear-gradient(180deg,rgba(255,210,96,0.8) -22.79%,#FFF6E1 50%,rgba(244,195,71,0.8) 122.79%)',
  },
  {
    label: 'White Gold',
    value: 'white-gold',
    gradient: 'linear-gradient(180deg,#C2BDB7 -7.27%,#F5F5F5 52.01%,#C2BDB7 100%)',
  },
  {
    label: 'Rose Gold',
    value: 'rose-gold',
    gradient: 'linear-gradient(180deg,#FFC4A2 -8.82%,#FFF7F1 45.59%,rgba(255,179,136,0.8) 100%)',
  },
  {
    label: 'Platinum',
    value: 'platinum',
    gradient: 'linear-gradient(180deg,#C2C2B7 -7.27%,#F5F5F5 52.01%,#C2C2B7 100%)',
  },
  {
    label: 'Silver',
    value: 'silver',
    gradient: 'linear-gradient(180deg,#C2BDB7 -7.27%,#F5F5F5 52.01%,#C2BDB7 100%)',
  },
  {
    label: 'Two-tone',
    value: 'two-tone',
    gradient: 'linear-gradient(180deg,rgba(197,156,54,0.7) -21.32%,#E6CD8F 21.49%,#FFFFFF 52.87%,#D9D6D3 80.13%,rgba(217,214,211,0.7) 108.09%)',
  },
];

export const SORT_OPTIONS: FilterOption[] = [
  {label: 'Popular', value: 'popular'},
  {label: 'Price (Lowest to Highest)', value: 'price-asc'},
  {label: 'Price (Highest to Lowest)', value: 'price-desc'},
  {label: 'Style Number (Oldest)', value: 'style-oldest'},
  {label: 'Style Number (Newest)', value: 'style-newest'},
];



export const COLOROPTIONS: FilterOption[] = [
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "K", label: "K" },
  { value: "J", label: "J" },
  { value: "I", label: "I" },
  { value: "H", label: "H" },
  { value: "G", label: "G" },
  { value: "F", label: "F" },
  { value: "E", label: "E" },
  { value: "D", label: "D" },
];

// Cut Options
export const CUTOPTIONS: FilterOption[] = [
  { value: "Good", label: "Good" },
  { value: "Very Good", label: "Very Good" },
  { value: "Ideal", label: "Ideal" },
  { value: "Excellent", label: "Excellent" },
];

export const COLLECTIONCUTOPTION: FilterOption[] = [
  { value: "GD", label: "Good" },
  { value: "VG", label: "Very Good" },
  { value: "ID", label: "Ideal" },
  { value: "EX", label: "Excellent" },
];
export const COLLECTIONSYMMETRYOPTIONS: FilterOption[] = [
  { value: "GD", label: "Good" },
  { value: "VG", label: "Very Good" },
  { value: "ID", label: "Ideal" },
  { value: "EX", label: "Excellent" },
];

export const COLLECTIONPOLISHOPTION: FilterOption[] = [
  { value: "GD", label: "Good" },
  { value: "VG", label: "Very Good" },
  { value: "ID", label: "Ideal" },
  { value: "EX", label: "Excellent" },
];

export const COLLECTIONFLUORESCENCEOPTIONS: FilterOption[] = [
  { value: "VStg", label: "VStg" },
  { value: "Stg", label: "Stg" },
  { value: "M", label: "M" },
  { value: "S", label: "S" },
  { value: "VS", label: "VS" },
  { value: "NON", label: "None" },
];


// Clarity Options
export const CLARITYOPTIONS: FilterOption[] = [
  { value: "ID", label: "ID" },
  { value: "I1", label: "I1" },
  { value: "SI2", label: "SI2" },
  { value: "SI1", label: "SI1" },
  { value: "VS2", label: "VS2" },
  { value: "VS1", label: "VS1" },
  { value: "VVS2", label: "VVS2" },
  { value: "VVS1", label: "VVS1" },
  { value: "IF", label: "IF" },
  { value: "FL", label: "FL" },
];

// Depth % Range
export const DEPTHOPTIONS: FilterRange = {
  min: 10,
  max: 100,
  step: 1,
};

// Polish Options
export const POLISHOPTIONS: FilterOption[] = [
  { value: "Good", label: "Good" },
  { value: "Very Good", label: "Very Good" },
  { value: "Ideal", label: "Ideal" },
  { value: "Excellent", label: "Excellent" },
];

// L/W Ratio Range
export const LWRATIOOPTIONS: FilterRange = {
  min: 0,
  max: 2.5,
  step: 0.01,
};

// Fluorescence Options
export const FLUORESCENCEOPTIONS: FilterOption[] = [
  { value: "VStg", label: "VStg" },
  { value: "Stg", label: "Stg" },
  { value: "M", label: "M" },
  { value: "S", label: "S" },
  { value: "VS", label: "VS" },
  { value: "none", label: "None" },
];

// Table % Range
export const TABLEOPTIONS: FilterRange = {
  min: 10,
  max: 100,
  step: 1,
};

// Symmetry Options
export const SYMMETRYOPTIONS: FilterOption[] = [
 { value: "Good", label: "Good" },
  { value: "Very Good", label: "Very Good" },
  { value: "Ideal", label: "Ideal" },
  { value: "Excellent", label: "Excellent" },
];