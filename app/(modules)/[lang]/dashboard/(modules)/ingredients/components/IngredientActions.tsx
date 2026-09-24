'use client';

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/app/components/ui/menubar';

import DeleteDialog from '@/app/components/DeleteDialog';
import EditIngredientDialog from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/components/EditIngredientDialog';
import { Ellipsis } from 'lucide-react';
import { IIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/interfaces';
import { deleteIngredient } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/actions';
import { useToast } from '@/app/hooks/use-toast';

interface IProps {
  ingredient: IIngredient;
}
const IngredientActions = ({ ingredient }: IProps) => {
  const { toast } = useToast();
  const handleOnDelete = async () => {
    const res = await deleteIngredient(ingredient.id);

    if (Object.keys(res).length === 0) {
      toast({
        variant: 'success',
        description: 'Ingredient deleted successfully.',
      });
    } else {
      toast({
        variant: 'error',
        description: res.error || 'Unknown error',
      });
    }
  };

  return (
    <Menubar className="w-fit border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="size-9 justify-center rounded-md p-0 text-muted-foreground hover:cursor-pointer hover:bg-accent hover:text-foreground">
          <Ellipsis />
        </MenubarTrigger>
        <MenubarContent>
          <EditIngredientDialog ingredient={ingredient} />
          <MenubarSeparator />
          <DeleteDialog
            onConfirm={handleOnDelete}
            title="Delete Ingredient"
            subtitle={`Are you sure you want to delete ${ingredient.name}?`}
          />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default IngredientActions;
