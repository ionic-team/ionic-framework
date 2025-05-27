import type { CapacitorGlobal } from '@capacitor/core';
import { win } from '@utils/browser';

type CustomCapacitorGlobal = CapacitorGlobal & {
  // Capacitor from @capacitor/core no longer exports Plugins, but we're pulling
  // Capacitor from window.Capacitor, which does
  Plugins: {
    [key: string]: any;
  };
};

export const getCapacitor = () => {
  if (win !== undefined) {
    return (win as any).Capacitor as CustomCapacitorGlobal;
  }
  return undefined;
};
