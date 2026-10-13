'use client';

import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

interface IMaintenanceOpen {
  open: boolean;
  toggle: () => void;
}

const MaintenanceOpenContext = createContext<IMaintenanceOpen>({
  open: false,
  toggle: () => {},
});

/** Whether one Meal plan row's Maintenance line is open, shared by its cells. */
export const MealPlanMaintenanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({ open, toggle: () => setOpen((current) => !current) }),
    [open],
  );

  return (
    <MaintenanceOpenContext.Provider value={value}>
      {children}
    </MaintenanceOpenContext.Provider>
  );
};

export const useMaintenanceOpen = () => useContext(MaintenanceOpenContext);
