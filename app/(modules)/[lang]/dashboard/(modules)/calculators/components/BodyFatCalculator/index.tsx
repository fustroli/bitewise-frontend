'use client';

import {
  IBodyFatResults,
  IBodyFatValues,
} from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/interfaces';
import React, { useState } from 'react';
import {
  calculateBodyFatMass,
  calculateBodyFatPercentage,
  calculateBodyFatWithBMI,
  calculateLeanBodyMass,
  categorizeBodyFat,
} from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/helpers';

import BodyFatForm from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/BodyFatCalculator/BodyFatForm';
import BodyFatResults from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/BodyFatCalculator/BodyFatResults';
import ResultsWrapper from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/ResultsWrapper';

const BodyFatCalculator = () => {
  const [results, setResults] = useState<IBodyFatResults | null>(null);

  const handleCalculate = (values: IBodyFatValues) => {
    const result = calculateBodyFatPercentage(values);
    const bmiBodyFatResult = calculateBodyFatWithBMI(values);
    const bodyFatCategory = categorizeBodyFat(values.gender, result);
    const bodyFatMass = calculateBodyFatMass(values.weight, result);
    const leanBodyMass = calculateLeanBodyMass(values.weight, result);

    setResults({
      bodyFatPercentage: result,
      bodyFatCategory,
      bodyFatMass,
      leanBodyMass,
      bmiBodyFatResult,
    });
  };

  const reset = () => setResults(null);

  return (
    <div className="relative w-full max-w-80 rounded-lg bg-card shadow-soft xl:w-fit">
      <div>
        <div className="flex items-center justify-between px-6 py-5">
          <h6 className="text-lg font-semibold text-foreground">
            Body Fat calculator (Metric units)
          </h6>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="h-4"></div>
        <BodyFatForm handleCalculate={handleCalculate} />
        {results && (
          <ResultsWrapper reset={reset} transition={!!results}>
            <BodyFatResults results={results} />
          </ResultsWrapper>
        )}
      </div>
    </div>
  );
};

export default BodyFatCalculator;
