import { RouterDirection } from '../models/RouterDirection';
import { AnimationBuilder } from '@ionic/core';

export type HrefProps<T> = Omit<T, 'routerDirection'> & {
  routerLink?: string;
  routerDirection?: RouterDirection;
  routerOptions?: unknown;
  routerAnimation?: AnimationBuilder;
};
