/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */
import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

type BraceletQuizInput = {
  perStoneSize: string;
  diamondShape: string;
  metalColor: string;
  totalCaratWeight: string;
};

type CsvRow = {
  'Stone Size Each': string;
  'Diamond Shape': string;
  'Metal Color': string;
  'Total Carat Weight': string;
  'Suggestion 1': string;
  'Suggestion 2': string;
  'Suggestion 3': string;
  'Suggestion 4': string;
};

type BraceletSuggestion = {
  Style: string;
  Metal: string;
  CaratWeight: string;
  summary: string;
};

type BraceletQuizResult = {
  suggestion1: BraceletSuggestion;
  suggestion2: BraceletSuggestion;
  suggestion3: BraceletSuggestion;
  suggestion4: BraceletSuggestion;
};

type HookResult = {
  isLoading: boolean;
  braceletData: BraceletQuizResult | null;
};

const normalize = (val?: string) =>
  (val || '').trim().toLowerCase().replace(/\s+/g, ' ');

const parseSuggestion = (value: string | undefined): BraceletSuggestion => {
  const [Style = '', Metal = '', CaratWeight = ''] = (value || '').split('|').map(v => v.trim());
  return {
    Style,
    Metal,
    CaratWeight,
    summary: `${Style} ${Metal} ${CaratWeight}`,
  };
};

export function useBraceletQuiz(csvPath: string, input: BraceletQuizInput): HookResult {
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
      error: (err) => {
        setIsLoading(false);
      },
    });
  }, [csvPath]);

  const braceletData = useMemo(() => {
    if (
      !input ||
      !input.perStoneSize ||
      !input.diamondShape ||
      !input.metalColor ||
      !input.totalCaratWeight ||
      !rows.length
    ) return null;

    const match = rows.find((row) =>
      normalize(row['Stone Size Each']) === normalize(input.perStoneSize) &&
      normalize(row['Diamond Shape']) === normalize(input.diamondShape) &&
      normalize(row['Metal Color']) === normalize(input.metalColor) &&
      normalize(row['Total Carat Weight']) === normalize(input.totalCaratWeight)
    );

    if (!match) {
      console.warn("❌ No matching bracelet row found for:", input);
      return null;
    }

    return {
      suggestion1: parseSuggestion(match['Suggestion 1']),
      suggestion2: parseSuggestion(match['Suggestion 2']),
      suggestion3: parseSuggestion(match['Suggestion 3']),
      suggestion4: parseSuggestion(match['Suggestion 4']),
    };
  }, [input, rows]);

  return {
    isLoading,
    braceletData,
  };
}
