/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */
import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

type PendantQuizInput = {
  selectedCarat: string;
  selectedShape: string;
  selectedMetalColor: string;
};

type CsvRow = {
  'Selected Shape': string;
  'Selected Metal Color': string;
  'Selected Carat': string;
  'Suggestion 1': string;
  'Suggestion 2': string;
  'Suggestion 3': string;
  'Suggestion 4': string;
  'Suggestion 5'?: string;
};

type PendantSuggestion = {
  Style: string;
  Metal: string;
  Carat: string;
  summary: string;
};

type PendantQuizResult = {
  suggestion1?: PendantSuggestion;
  suggestion2?: PendantSuggestion;
  suggestion3?: PendantSuggestion;
  suggestion4?: PendantSuggestion;
  suggestion5?: PendantSuggestion;
};

type HookResult = {
  isLoading: boolean;
  pendantData: PendantQuizResult | null;
};

const normalize = (val?: string) =>
  (val || '').trim().toLowerCase().replace(/\s+/g, ' ');

const parseSuggestion = (value: string | undefined): PendantSuggestion | undefined => {
  if (!value || normalize(value) === 'n/a') return undefined;
  const [Style = '', Metal = '', Carat = ''] = value.split('|').map(v => v.trim());
  return {
    Style,
    Metal,
    Carat,
    summary: `${Style} ${Metal} ${Carat}`
  };
};

export function usePendantQuiz(csvPath: string, input: PendantQuizInput): HookResult {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<CsvRow[]>([]);

  useEffect(() => {
    setIsLoading(true);
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CsvRow[];
        setRows(data);
        setIsLoading(false);
        
      },
      error: (err) => {
        setIsLoading(false);
      }
    });
  }, [csvPath]);

  const pendantData = useMemo(() => {
    if (
      !input ||
      !input.selectedCarat ||
      !input.selectedShape ||
      !input.selectedMetalColor ||
      !rows.length
    ) return null;

    const normalizedInput = {
      carat: normalize(input.selectedCarat),
      shape: normalize(input.selectedShape),
      metalColor: normalize(input.selectedMetalColor),
    };
    const match = rows.find((row) =>
      normalize(row['Selected Carat']) === normalizedInput.carat &&
      normalize(row['Selected Shape']) === normalizedInput.shape &&
      normalize(row['Selected Metal Color']) === normalizedInput.metalColor
    );

    if (!match) {
      console.warn('❌ No matching pendant row found for:', input);
      return null;
    }

    return {
      suggestion1: parseSuggestion(match['Suggestion 1']),
      suggestion2: parseSuggestion(match['Suggestion 2']),
      suggestion3: parseSuggestion(match['Suggestion 3']),
      suggestion4: parseSuggestion(match['Suggestion 4']),
      suggestion5: parseSuggestion(match['Suggestion 5']),
    };
  }, [input, rows]);

  return {
    isLoading,
    pendantData
  };
}
