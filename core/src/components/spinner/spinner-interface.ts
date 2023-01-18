export { SpinnerTypes } from './spinner-configs';

export interface SpinnerConfigs {
  [spinnerName: string]: SpinnerConfig;
}

export interface SpinnerConfig {
  dur: number;
  circles?: number;
  lines?: number;
  elmDuration?: boolean;
  fn: (dur: number, index: number, total: number) => SpinnerData;
}

export interface SpinnerData {
  r?: number;
  y1?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  style: any; // TODO(FW-2832): type
  viewBox?: string;
  transform?: string;
}
