
export interface ItemReorderDetail {
  from: number;
  to: number;
  complete: (data?: boolean | any[]) => any;
}
