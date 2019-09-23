export declare type RouterDirection = 'forward' | 'back' | 'none';

export type HrefProps<T> = Omit<T, 'routerDirection'> & {
  routerDirection?: RouterDirection;
};
