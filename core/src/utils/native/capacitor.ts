import type { CapacitorInstance } from '@capacitor/core/types/definitions-internal';

let capacitor: CapacitorInstance | undefined;

export const getCapacitor = () => {
  if (capacitor !== undefined) {
    return capacitor;
  }
  if (window !== undefined) {
    return (window as any)?.Capacitor as CapacitorInstance;
  }
  return undefined;
};
