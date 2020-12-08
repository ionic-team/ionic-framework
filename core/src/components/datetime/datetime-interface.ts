import { PickerOptions } from '../../index';

export type DatetimeOptions = Partial<PickerOptions>;

export interface DatetimeChangeEventDetail {
  value: string | undefined | null;
}
