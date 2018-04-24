export { GestureController } from './gesture-controller';
export * from './gesture-controller-utils';

export interface GestureConfig {
  name: string;
  priority?: number;
  disableScroll?: boolean;
}

export interface BlockerConfig {
  disable?: string[];
  disableScroll?: boolean;
}
