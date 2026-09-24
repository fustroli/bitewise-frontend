'use client';

import {
  ICalorieResults,
  ICalorieValues,
} from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/interfaces';
import React, { useState } from 'react';

import CalorieForm from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/CalorieCalculator/CalorieForm';
import CalorieResults from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/CalorieCalculator/CalorieResults';
import ResultsWrapper from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/ResultsWrapper';
import { calculateWeightChangeCalories } from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/helpers/calorie.helpers';

const CalorieCalculator = () => {
  const [results, setResults] = useState<ICalorieResults | null>(null);

  const handleCalculate = (values: ICalorieValues) => {
    const result = calculateWeightChangeCalories(values);

    setResults({ ...result });
  };

  const reset = () => setResults(null);

  return (
    <div className="relative w-full max-w-80 rounded-lg bg-card shadow-soft xl:w-fit">
      <div>
        <div className="flex items-center justify-between px-6 py-5">
          <h6 className="text-lg font-semibold text-foreground">
            Calorie calculator (Metric units)
          </h6>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="h-4"></div>
        <CalorieForm handleCalculate={handleCalculate} />
        {results && (
          <ResultsWrapper reset={reset} transition={!!results}>
            <CalorieResults results={results} />
          </ResultsWrapper>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator;
