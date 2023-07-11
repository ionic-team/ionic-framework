import type { CapacitorGlobal } from '@capacitor/core';
import { win } from '@utils/browser';

let capacitor: CapacitorGlobal | undefined;

export const getCapacitor = () => {
  if (capacitor !== undefined) {
    return capacitor;
  }
  if (win !== undefined) {
    return (win as any).Capacitor as CapacitorGlobal;
  }
  return undefined;
};
