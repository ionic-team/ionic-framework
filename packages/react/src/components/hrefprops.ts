import { RouterDirection } from '../models/RouterDirection';

export type HrefProps<T> = Omit<T, 'routerDirection'> & {
  routerLink?: string;
  routerDirection?: RouterDirection;
  routerOptions?: unknown
};
