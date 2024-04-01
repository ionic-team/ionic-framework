import type { CapacitorGlobal } from '@capacitor/core';
import { win } from '@utils/browser';

export const getCapacitor = () => {
  if (win !== undefined) {
    return (win as any)
      .Capacitor as CapacitorGlobal;
  }
  return undefined;
};
