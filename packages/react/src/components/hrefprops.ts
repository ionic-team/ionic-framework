import { AnimationBuilder } from '@ionic/core';

import { RouterOptions } from '../models';
import { RouterDirection } from '../models/RouterDirection';

export type HrefProps<T> = Omit<T, 'routerDirection'> & {
  routerLink?: string;
  routerDirection?: RouterDirection;
  routerOptions?: RouterOptions;
  routerAnimation?: AnimationBuilder;
};
