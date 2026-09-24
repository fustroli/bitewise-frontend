'use client';

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/app/components/ui/menubar';

import DeleteDialog from '@/app/components/DeleteDialog';
import EditMealDialog from '@/app/(modules)/[lang]/dashboard/(modules)/meals/components/EditMealDialog';
import { Ellipsis } from 'lucide-react';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { IMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/interfaces';
import { deleteMeal } from '@/app/(modules)/[lang]/dashboard/(modules)/meals/actions';

interface IProps {
  meal: IMeal;
  ingredients: IIngredient[];
}
const MealActions = ({ meal, ingredients }: IProps) => {
  const handleOnDelete = async () => {
    await deleteMeal(meal.id);
  };

  return (
    <Menubar className="w-fit border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="size-9 justify-center rounded-md p-0 text-muted-foreground hover:cursor-pointer hover:bg-accent hover:text-foreground">
          <Ellipsis />
        </MenubarTrigger>
        <MenubarContent>
          <EditMealDialog meal={meal} ingredients={ingredients} />
          <MenubarSeparator />
          <DeleteDialog
            onConfirm={handleOnDelete}
            title="Delete Meal"
            subtitle={`Are you sure you want to delete ${meal.name}?`}
          />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MealActions;
