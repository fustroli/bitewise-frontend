import BmiCalculator from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/BmiCalculator';
import BodyFatCalculator from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/BodyFatCalculator';
import CalorieCalculator from '@/app/(modules)/[lang]/dashboard/(modules)/calculators/components/CalorieCalculator';

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-8 px-4 pb-8 md:flex-row md:items-start md:px-8">
      <BodyFatCalculator />
      <BmiCalculator />
      <CalorieCalculator />
    </div>
  );
}
