'use client';

import * as userActions from '@/app/(modules)/[lang]/dashboard/(modules)/_user/actions';

import {
  ITargets,
  IUser,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import {
  IUserActions,
  IUserContext,
  UserContext,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { TApiResult } from '@/app/utils/interfaces';

interface IProps extends PropsWithChildren {
  authUser: IUser;
  /** The backend calls to make; tests pass fakes. */
  actions?: IUserActions;
}

export const UserProvider: React.FC<IProps> = ({
  authUser,
  actions = userActions,
  children,
}) => {
  const [user, setUser] = useState(authUser);

  const apply = useCallback((result: TApiResult<IUser>) => {
    if (result.ok) setUser(result.data);
    return result;
  }, []);

  const updateTargets = useCallback(
    async (change: Partial<ITargets>) => {
      const before = user.targets;
      const withTargets = (current: IUser, targets: Partial<ITargets>) => ({
        ...current,
        targets: {
          calorieTarget: null,
          macroPlan: null,
          ...current.targets,
          ...targets,
        },
      });

      setUser((current) => withTargets(current, change));
      const result = await actions.updateUser({ targets: change });
      if (!result.ok) {
        // Only the fields still showing this pick, so a later pick stays.
        setUser((current) => {
          const keys = (Object.keys(change) as (keyof ITargets)[]).filter(
            (key) => current.targets?.[key] === change[key],
          );
          return withTargets(
            current,
            Object.fromEntries(keys.map((key) => [key, before?.[key] ?? null])),
          );
        });
      }
      return result;
    },
    [user.targets, actions],
  );

  const value = useMemo<IUserContext>(
    () => ({
      user,
      updateUser: async (change) => apply(await actions.updateUser(change)),
      updateAvatar: async (formData) =>
        apply(await actions.updateAvatar(formData)),
      requestEmailChange: async (change) =>
        apply(await actions.requestEmailChange(change)),
      cancelEmailChange: async () => apply(await actions.cancelEmailChange()),
      updateTargets,
    }),
    [user, actions, apply, updateTargets],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
