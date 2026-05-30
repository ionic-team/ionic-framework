import type { AnimationBuilder } from '@ionic/core/components';

import type { RouterOptions } from '../models';
import type { RouterDirection } from '../models/RouterDirection';

export type HrefProps<T> = Omit<T, 'routerDirection'> & {
  routerLink?: string;
  routerDirection?: RouterDirection;
  routerOptions?: RouterOptions;
  routerAnimation?: AnimationBuilder;
};
