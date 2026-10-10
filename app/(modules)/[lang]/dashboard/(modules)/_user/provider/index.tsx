'use client';

import * as userActions from '@/app/(modules)/[lang]/dashboard/(modules)/_user/actions';

import {
  IUserActions,
  IUserContext,
  UserContext,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
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

  const value = useMemo<IUserContext>(
    () => ({
      user,
      updateUser: async (change) => apply(await actions.updateUser(change)),
      updateAvatar: async (formData) =>
        apply(await actions.updateAvatar(formData)),
    }),
    [user, actions, apply],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
