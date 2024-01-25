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
  style: { [key: string]: string | undefined };
  viewBox?: string;
  transform?: string;
}
