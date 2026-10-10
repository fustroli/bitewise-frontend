'use client';

import { convertToOptions, interpolate } from '@/app/utils/helpers';

import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { IResourceFieldsProps } from '@/app/(modules)/[lang]/dashboard/(modules)/_resource-table/interfaces';
import InputField from '@/app/components/form/InputField';
import MultiSelectField from '@/app/components/form/MultiSelectField';
import { TMealPlanSchema } from '@/app/(modules)/[lang]/dashboard/(modules)/meal-plans/validations';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useMemo } from 'react';

const MealPlanFields = ({
  form,
  formData: meals,
}: IResourceFieldsProps<TMealPlanSchema, IMeal[]>) => {
  const {
    resourceTable,
    resources: {
      mealPlans: { fields },
    },
  } = useDictionary();

  const options = useMemo(() => convertToOptions(meals), [meals]);

  return (
    <>
      <InputField form={form} label={fields.name} name="name" type="text" />
      <MultiSelectField
        form={form}
        name="mealIds"
        label={fields.meals}
        options={options}
        placeholder={fields.mealsPlaceholder}
        searchPlaceholder={resourceTable.search}
        emptyText={resourceTable.notFound}
        removeLabel={(option) =>
          interpolate(resourceTable.remove, { name: option.label })
        }
      />
    </>
  );
};

export default MealPlanFields;
