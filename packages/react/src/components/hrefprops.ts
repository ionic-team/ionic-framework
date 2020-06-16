import { AnimationBuilder } from '@ionic/core';

import { RouterDirection } from '../models/RouterDirection';

export type HrefProps<T> = Omit<T, 'routerDirection'> & {
  routerLink?: string;
  routerDirection?: RouterDirection;
  routerOptions?: { as?: string, unmount?: boolean };
  routerAnimation?: AnimationBuilder;
};
