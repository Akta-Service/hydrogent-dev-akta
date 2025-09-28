import roundedShape from '~/assets/images/demo/round.png';
import ovalShape from '~/assets/images/demo/oval.png';
import radiantShape from '~/assets/images/demo/radient.png';
import pearShape from '~/assets/images/demo/pear.png';
import cushionShape from '~/assets/images/demo/cusion.png';
import princessShape from '~/assets/images/demo/princess.png';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
  image?: string;
  gradient?: string;
}

interface FilterRange {
  min: number;
  max: number;
  step: number;
}

// Collection data constants
export const collectionData = [
  {
    node: {
      id: 'gid://shopify/Collection/510343905594',
      handle: 'rings',
      title: 'RINGS',
      description: '',
      image: {
        altText: null,
        url: '/assets/images/home/gianna.png',
      },
      displayInTabs: {
        value: 'true',
      },
      defineShapeStyle: null,
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/9971857523002',
              title: 'Gianna',
              handle: '1-gianna?Metal+Color=14K+WHITE&Diamond+Shape=ROUND&Diamond+Size=1',
              description: 'Forever Set in Diamonds... Bello Diamonds',
              featuredImage: {
                url: '/assets/images/home/gianna.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $2224.99',
                  currencyCode: 'USD',
                },
              },
              media: {
                edges: [
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43475130024250',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/gianna.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43467683463482',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/gianna.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43446771581242',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/gianna.png',
                        altText: null,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971858342202',
              title: 'Bianca',
              handle: '1-bianca?Metal+Color=14K+WHITE&Diamond+Shape=ROUND&Diamond+Size=1',
              description: '',
              featuredImage: {
                url: '/craft/ring1.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $2724.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971857031482',
              title: 'Paola',
              handle: '1-paola?Metal+Color=14K+WHITE&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/ring2.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $899.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971856441658',
              title: 'Francesca',
              handle: '1-francesca?Metal+Color=14K+WHITE&Diamond+Shape=OVAL&Diamond+Size=1',
              description: '',
              featuredImage: {
                url: '/craft/ring3.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1849.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971855950138',
              title: 'Arianna',
              handle: '1-arianna?Metal+Color=14K+WHITE&Diamond+Shape=ROUND&Diamond+Size=1',
              description: '',
              featuredImage: {
                url: '/craft/ring4.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $2099.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: 'gid://shopify/Collection/510344003898',
      handle: 'bracelet',
      title: 'BRACELETS',
      description: '',
      image: {
        altText: null,
        url: '/craft/bracelate.png',
      },
      displayInTabs: {
        value: 'true',
      },
      defineShapeStyle: null,
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/9973474918714',
              title: 'Serena',
              handle: 'serena?Metal+Color=14K+WHITE&Diamond+Shape=Pear&Total+Diamond+Weight=4',
              description: 'Effortless Sparkle on Repeat',
              featuredImage: {
                url: '/craft/bracelate.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $3599.99',
                  currencyCode: 'USD',
                },
              },
              media: {
                edges: [
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43467773018426',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/bracelate.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43464881373498',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/bracelate.png',
                        altText: null,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9973475705146',
              title: 'Blanca',
              handle: '1-blanca?Metal+Color=14K+WHITE&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/luxuryringseries.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1199.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9973476950330',
              title: 'Justina',
              handle: '4-justina?Metal+Color=14K+WHITE&Total+Carat+Weight=4',
              description: '',
              featuredImage: {
                url: '/craft/twilightsparkle.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $3099.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9973478162746',
              title: 'Aurora',
              handle: '4-aurora?Metal+Color=14K+WHITE&Total+Carat+Weight=4',
              description: '',
              featuredImage: {
                url: '/craft/blindheritage.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $3099.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9973479375162',
              title: 'Valentina',
              handle: 'valentina?Metal+Color=14K+WHITE&Diamond+Shape=Round&Total+Diamond+Weight=4',
              description: '',
              featuredImage: {
                url: '/craft/wildflowerings.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $3499.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: 'gid://shopify/Collection/510344069434',
      handle: 'earings',
      title: 'EARRINGS',
      description: '',
      image: {
        altText: null,
        url: '/craft/earringsmain.png',
      },
      displayInTabs: {
        value: 'true',
      },
      defineShapeStyle: null,
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/9971849429306',
              title: 'Natalia',
              handle: 'natalia?Metal+Color=14K+WHITE&Diamond+Shape=Round&Total+Carat+Weight=1',
              description: 'Balanced Sparkle, Brilliantly Paired',
              featuredImage: {
                url: '/craft/earringsmain.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1694.99',
                  currencyCode: 'USD',
                },
              },
              media: {
                edges: [
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43475146506554',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/earringsmain.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43467696505146',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/earringsmain.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43446730719546',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/earringsmain.png',
                        altText: null,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971849691450',
              title: 'Corina',
              handle: '1-corina?Metal+Color=14K+WHITE&Diamond+Shape=ROUND&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/luxuryringseriess.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1094.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971850084666',
              title: 'Claudia',
              handle: 'claudia?Metal+Color=14K+WHITE&Diamond+Shape=Round&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/twilightspakrleearing.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1794.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971850740026',
              title: 'Clara',
              handle: '1-clara?Metal+Color=14K+WHITE&Diamond+Shape=ROUND&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/blindheritageearing.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1094.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971849888058',
              title: 'Alessandra',
              handle: 'alessandra?Metal+Color=14K+WHITE&Diamond+Shape=Marquise&Total+Diamond+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/wildfloweringsearing.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $994.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: 'gid://shopify/Collection/510344102202',
      handle: 'necklace',
      title: 'NECKLACES',
      description: '',
      image: {
        altText: 'Necklaces',
        url: '/craft/necklacemain.png',
      },
      displayInTabs: {
        value: 'true',
      },
      defineShapeStyle: null,
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/9971852149050',
              title: 'Rosanna',
              handle: '5-rosanna?Metal+Color=14K+WHITE&Diamond+Shape=ROUND&Total+Carat+Weight=5',
              description: 'Just Diamonds, No Distractions!',
              featuredImage: {
                url: '/craft/necklacemain.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $4794.99',
                  currencyCode: 'USD',
                },
              },
              media: {
                edges: [
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43474922012986',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/necklacemain.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43467661771066',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/necklacemain.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43446754869562',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/necklacemain.png',
                        altText: null,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971852738874',
              title: 'Luisa',
              handle: '1-luisa?Metal+Color=14K+WHITE&Diamond+Shape=ROUND&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/neck.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1094.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971853492538',
              title: 'Brianna',
              handle: 'brianna?Metal+Color=14K+WHITE&Diamond+Shape=Emerald&Total+Carat+Weight=10',
              description: '',
              featuredImage: {
                url: '/craft/twilighsparke.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $7494.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971854606650',
              title: 'Naomi',
              handle: '1-naomi?Metal+Color=14K+YELLOW&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/blidnneck.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $994.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9971854901562',
              title: 'Gloria',
              handle: '1-gloria?Metal+Color=14K+ROSE&Diamond+Shape=CUSHION&Total+Carat+Weight=1',
              description: '',
              featuredImage: {
                url: '/craft/necwood.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $1194.99',
                  currencyCode: 'USD',
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    node: {
      id: 'gid://shopify/Collection/510344167738',
      handle: 'jewelry-set',
      title: 'JEWELRY SETS',
      description: '',
      image: {
        altText: null,
        url: '/craft/jewelryset.png',
      },
      displayInTabs: {
        value: 'true',
      },
      defineShapeStyle: null,
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/9981447831866',
              title: 'Luna Set',
              handle: 'luna',
              description: '',
              featuredImage: {
                url: '/craft/jewelryset.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $11,295',
                  currencyCode: 'USD',
                },
              },
              media: {
                edges: [
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43474922012986',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/jewelryset.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43467661771066',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/jewelryset.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43446754869562',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/jewelryset.png',
                        altText: null,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              id: 'gid://shopify/Product/9981447569722',
              title: 'Venus Set',
              handle: 'venus',
              description: '',
              featuredImage: {
                url: '/craft/jewelryset1.png',
                altText: null,
              },
              priceRange: {
                minVariantPrice: {
                  amount: 'From $3695',
                  currencyCode: 'USD',
                },
              },
               media: {
                edges: [
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43474922012986',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/jewelryset1.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43467661771066',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/jewelryset1.png',
                        altText: null,
                      },
                    },
                  },
                  {
                    node: {
                      __typename: 'MediaImage',
                      id: 'gid://shopify/MediaImage/43446754869562',
                      mediaContentType: 'IMAGE',
                      alt: '',
                      image: {
                        url: '/craft/jewelryset1.png',
                        altText: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
];

// Filter constants
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
  {label: 'Style Number (Oldest)', value: 'price-ascending'},
  {label: 'Style Number (Newest)', value: 'style-desc'},
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
{ value: "GD", label: "Good" },
  { value: "VG", label: "Very Good" },
  { value: "ID", label: "Ideal" },
  { value: "EX", label: "Excellent" },
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
{ value: "GD", label: "Good" },
  { value: "VG", label: "Very Good" },
  { value: "ID", label: "Ideal" },
  { value: "EX", label: "Excellent" },
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
  { value: "None", label: "None" },
];

// Table % Range
export const TABLEOPTIONS: FilterRange = {
  min: 10,
  max: 100,
  step: 1,
};

// Symmetry Options
export const SYMMETRYOPTIONS: FilterOption[] = [
{ value: "GD", label: "Good" },
  { value: "VG", label: "Very Good" },
  { value: "ID", label: "Ideal" },
  { value: "EX", label: "Excellent" },
];

// Product Options Constants
export const METAL_COLOR_MAP: Record<string, {className: string; label: string}> = {
  white: {className: 'bg-white-gold', label: 'White'},
  yellow: {className: 'bg-yellow-gold', label: 'Yellow'},
  rose: {className: 'bg-rose-gold', label: 'Rose'},
  platinum: {className: 'bg-platinum', label: 'Platinum'},
};

export const DIAMOND_SHAPE_IMAGES: Record<string, string> = {
  Round: '/diamondIcons/Round.svg',
  Asscher: '/diamondIcons/Asscher.svg',
  Oval: '/diamondIcons/oval.svg',
  Cushion: '/diamondIcons/Cushion.svg',
  Emerald: '/diamondIcons/Emerald.svg',
  Princess: '/diamondIcons/Princess.svg',
  Pear: '/diamondIcons/Pear.svg',
  Marquise: '/diamondIcons/Marquise.svg',
  Heart: '/diamondIcons/Heart.svg',
  Radiant: '/diamondIcons/Radiant.svg',
};

// Product Benefits Constants
export const BENEFIT_ICONS = {
  order: '/svg/freeship.svg',
  free: '/svg/free.svg',
  secure: '/svg/secure.svg',
  guarantee: '/svg/gurantee.svg',
  shopify: '/svg/bagg.png',
};

export const BENEFITS = [
  { icon: 'order', text: "Free Shipping for all orders" },
  { icon: 'secure', text: "Secure payment" },
  { icon: 'free', text: "Free Signature Gift Box" },
  { icon: 'guarantee', text: "30 Day Full Money Back Guarantee" },
  {
    icon: 'shopify',
    text: "Shop with confidence: Encrypted shopping by Shopify",
  },
];

// Product Info Constants
export const DIAMOND_SHAPES = {
  round: '/demo/roundshape.png',
  oval: '/demo/ovalshape.png',
  radiant: '/demo/ovalshape.png',
  pear: '/demo/pear.png',
  cushion: '/demo/cusion.png',
  princess: '/demo/princess.png',
  emerald: '/demo/emraldshape.png',
  marquise: '/demo/marquiseshape.png',
  heart: '/demo/heartshape.png',
  asscher: '/demo/asschershape.png',
};

export const RING_COLORS = [
  {
    value: 'yellow-gold',
    gradient:
      'linear-gradient(180deg,rgba(255,210,96,0.8) -22.79%,#FFF6E1 50%,rgba(244,195,71,0.8) 122.79%)',
  },
  {
    value: 'white-gold',
    gradient:
      'linear-gradient(180deg,#C2BDB7 -7.27%,#F5F5F5 52.01%,#C2BDB7 100%)',
  },
  {
    value: 'rose-gold',
    gradient:
      'linear-gradient(180deg,#FFC4A2 -8.82%,#FFF7F1 45.59%,rgba(255,179,136,0.8) 100%)',
  },
  {
    value: 'platinum',
    gradient:
      'linear-gradient(180deg,#C2C2B7 -7.27%,#F5F5F5 52.01%,#C2C2B7 100%)',
  },
];

export const STONE_DETAILS = [
  {label: 'Carat', value: '0.92ctw'},
  {label: 'Color', value: 'F'},
  {label: 'Clarity', value: 'VS'},
];

// Collection Page Constants
export const SHAPE_ICONS: Record<string, string> = {
  round: '/diamondIcons/Round.svg',
  asscher: '/diamondIcons/Asscher.svg',
  oval: '/diamondIcons/oval.svg',
  cushion: '/diamondIcons/Cushion.svg',
  emerald: '/diamondIcons/Emerald.svg',
  princess: '/diamondIcons/Princess.svg',
  pear: '/diamondIcons/Pear.svg',
  marquise: '/diamondIcons/Marquise.svg',
  heart: '/diamondIcons/Heart.svg',
  radiant: '/diamondIcons/Radiant.svg',
};

// Collection Page Collections Data
export const RING_STYLE_COLLECTIONS = [
  {
    handle: 'SOLITAIRE',
    title: 'Solitaire',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_f5dcf687-1fe6-4aad-8e19-b59d1206152c.png?v=1747899698',
    },
  },
  {
    handle: 'Halo',
    title: 'Halo',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_1_5c7d25e8-0461-47d1-985d-4f27caa20f5f.png?v=1747899756',
    },
  },
  // {
  //   handle: 'under-halo',
  //   title: 'Under Halo',
  //   image: {
  //     url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_2.png?v=1747899806',
  //   },
  // },
  {
    handle: 'vintage',
    title: 'Vintage',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_3_65e0e88c-2b1b-471c-af3f-f5c3d6376f4a.png?v=1747899849',
    },
  },
  {
    handle: 'Side Stones',
    title: 'Sidestone',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_4_5b8ff5ad-5ded-4833-baa8-271416a31ec3.png?v=1747899894',
    },
  },
  {
    handle: 'three-stone',
    title: 'Three Stone',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_5_726127a9-9823-4500-ae81-c59eb4428cc5.png?v=1747900005',
    },
  },
  {
    handle: 'contemporary',
    title: 'Contemporary',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_6.png?v=1747900005',
    },
  },
  // {
  //   handle: 'gemstone',
  //   title: 'Gemstone',
  //   image: {
  //     url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_7.png?v=1747900172',
  //   },
  // },
  // {
  //   handle: 'fancy-color',
  //   title: 'Fancy Color',
  //   image: {
  //     url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_8.png?v=1747900125',
  //   },
  // },
];

export const DIAMOND_COLOR_COLLECTIONS = [
  {
    handle: '14K WHITE',
    title: '14K White Gold',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Category.png?v=1752819568',
    },
  },
  {
    handle: '14K YELLOW',
    title: '14K Yellow Gold',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Category_1.png?v=1752819622',
    },
  },
  {
    handle: '14K ROSE',
    title: '14K Rose Gold',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Category_2.png?v=1752819636',
    },
  },
  {
    handle: 'PLATINUM',
    title: 'Platinum',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Category_6.png?v=1752819516',
    },
  },
];

export const DIAMOND_SHAPE_COLLECTIONS = [
  {
    handle: 'Radiant',
    title: 'Radiant',
    image: {url: '/diamondIcons/Radiant.svg'},
  },
  {
    handle: 'CUSHION BRILLIANT',
    title: 'Cushion',
    image: {url: '/diamondIcons/Cushion.svg'},
  },
  {
    handle: 'Asscher',
    title: 'Asscher',
    image: {url: '/diamondIcons/Asscher.svg'},
  },
  {
    handle: 'Emerald',
    title: 'Emerald',
    image: {url: '/diamondIcons/Emerald.svg'},
  },
  {handle: 'HEART', title: 'Heart', image: {url: '/diamondIcons/Heart.svg'}},
  {
    handle: 'Marquise',
    title: 'Marquise',
    image: {url: '/diamondIcons/Marquise.svg'},
  },
  {handle: 'Oval', title: 'Oval', image: {url: '/diamondIcons/oval.svg'}},
  {handle: 'Pear', title: 'Pear', image: {url: '/diamondIcons/Pear.svg'}},
  {
    handle: 'Princess',
    title: 'Princess',
    image: {url: '/diamondIcons/Princess.svg'},
  },
  {handle: 'ROUND', title: 'Round', image: {url: '/diamondIcons/Round.svg'}},
];

export const PENDANT_SHAPE_COLLECTIONS = [
  {
    handle: 'Round',
    title: 'Round',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/round.png?v=1752830531',
    },
  },
  {
    handle: 'Princess',
    title: 'Princess',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/princess.png?v=1752831139',
    },
  },
  {
    handle: 'Emerald',
    title: 'Emerald',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/emerald.png?v=1752831655',
    },
  },
  {
    handle: 'Oval',
    title: 'Oval',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/oval.png?v=1752830567',
    },
  },
  {
    handle: 'Marquise',
    title: 'Marquise',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_8_4ba0723d-349c-4da8-ab10-6759890b5687.png?v=1752831586',
    },
  },
  {
    handle: 'Pear',
    title: 'Pear',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0937/6904/0186/collections/Image_5_e7a7ea9a-8d99-4392-b6a1-d2409617e41c.png?v=1752831020',
    },
  },
];

// Endpoint constants
export const SEARCH_ENDPOINT = '/search';