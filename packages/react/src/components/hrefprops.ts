export declare type RouterDirection = 'forward' | 'back' | 'none';

export type HrefProps<T> = Omit<T, 'routerDirection'> & {
  routerLink?: string;
  routerDirection?: RouterDirection;
};
