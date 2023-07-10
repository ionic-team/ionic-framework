import type { CapacitorGlobal } from '@capacitor/core';

let capacitor: CapacitorGlobal | undefined;

export const getCapacitor = () => {
  if (capacitor !== undefined) {
    return capacitor;
  }
  if (window !== undefined) {
    return (window as any)?.Capacitor as CapacitorGlobal;
  }
  return undefined;
};
