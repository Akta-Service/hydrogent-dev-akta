/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */


import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

type QuizInput = {
  shapes: string[];        // e.g. ['Round'] or ['Round', 'Oval']
  talentShow: string;      // e.g. 'Center Stage'
  promJewelry: string;     // e.g. 'Full Sparkle (Necklace, Earrings, Bracelet, Watch)'
  gloveSize: string;       // e.g. 'Small'
};

type CsvRow = {
  [key: string]: string;
};

type RingSuggestion = {
  Style: string;
  Shape: string;
  Carat: string;
  Metal: string;
  GoldColor: string;
  searchKeys?: string;
};

type RingResult = {
  suggestion1: RingSuggestion;
  suggestion2: RingSuggestion;
  suggestion3: RingSuggestion;
  suggestion4: RingSuggestion;
};


type HookResult = {
  isLoading: boolean;
  personality: string | null;
  ringData: RingResult | null;
};

const normalize = (val?: string): string =>
  (val || '').trim().toLowerCase().replace(/\s+/g, ' ');

export function useRingQuizOne(csvPath: string, input: QuizInput): HookResult {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<CsvRow[]>([]);

  useEffect(() => {
    setIsLoading(true);
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data as CsvRow[]);
        setIsLoading(false);
      },
      error: () => setIsLoading(false),
    });
  }, [csvPath]);

  const ringData = useMemo(() => {
  if (!input || !input.shapes.length || !rows.length) return null;

  const shapeKey = input.shapes.map(normalize).join(', ');

  const match = rows.find((row) => {
    return (
      normalize(row['Shapes']) === shapeKey &&
      normalize(row['Talent Show']) === normalize(input.talentShow) &&
      normalize(row['Prom Jewelry']) === normalize(input.promJewelry) &&
      normalize(row['Glove Size']) === normalize(input.gloveSize)
    );
  });

  if (!match) return null;

return {
  suggestion1: {
    Style: match['Style 1'],
    Shape: match['Shape 1'],
    Carat: match['Carat 1'],
    Metal: match['Metal 1'],
    GoldColor: match['Gold Color 1'],
    searchKeys: `${match['Style 1']} ${match['Shape 1']} ${match['Carat 1']} ${match['Metal 1']} ${match['Gold Color 1']}`,
  },
  suggestion2: {
    Style: match['Style 2'],
    Shape: match['Shape 2'],
    Carat: match['Carat 2'],
    Metal: match['Metal 2'],
    GoldColor: match['Gold Color 2'],
    searchKeys: `${match['Style 2']} ${match['Shape 2']} ${match['Carat 2']} ${match['Metal 2']} ${match['Gold Color 2']}`,
  },
  suggestion3: {
    Style: match['Style 3'],
    Shape: match['Shape 3'],
    Carat: match['Carat 3'],
    Metal: match['Metal 3'],
    GoldColor: match['Gold Color 3'],
    searchKeys: `${match['Style 3']} ${match['Shape 3']} ${match['Carat 3']} ${match['Metal 3']} ${match['Gold Color 3']}`,
  },
  suggestion4: {
    Style: match['Style 4'],
    Shape: match['Shape 4'],
    Carat: match['Carat 4'],
    Metal: match['Metal 4'],
    GoldColor: match['Gold Color 4'],
    searchKeys: `${match['Style 4']} ${match['Shape 4']} ${match['Carat 4']} ${match['Metal 4']} ${match['Gold Color 4']}`,
  }
};
}, [input, rows]);


  const personality = useMemo(() => {
    if (!input || !input.promJewelry || !input.talentShow) return null;

    const key = `${input.promJewelry.trim()} + ${input.talentShow.trim()}`;
    const map: Record<string, string> = {
      'Full Sparkle (Necklace, Earrings, Bracelet, Watch) + Center Stage': 'Glamorous',
      'Necklace & Earrings + Center Stage': 'Classic',
      'Full Sparkle (Necklace, Earrings, Bracelet, Watch) + Not Attending': 'Glamorous',
      'No Jewelry + Not Attending': 'Minimalistic',
      'Earrings Only + Center Stage': 'Trendy',
      'Earrings Only + Shy': 'Classic',
      'No Jewelry + Shy': 'Minimalistic',
      'Earrings Only + Not Attending': 'Classic',
      'Necklace Only + Shy': 'Classic',
      'No Jewelry + In the Crowd': 'Minimalistic',
      'Earrings Only + In the Crowd': 'Classic',
      'Necklace Only + In the Crowd': 'Classic',
      'Full Sparkle (Necklace, Earrings, Bracelet, Watch) + Shy': 'Glamorous',
      'Necklace & Earrings + Shy': 'Classic',
      'Full Sparkle (Necklace, Earrings, Bracelet, Watch) + In the Crowd': 'Glamorous',
      'Necklace & Earrings + In the Crowd': 'Classic',
      'No Jewelry + Center Stage': 'Minimalistic',
    };
    return map[key] || 'Classic';
  }, [input.promJewelry, input.talentShow]);

  return {
    isLoading,
    personality,
    ringData,
  };
}
