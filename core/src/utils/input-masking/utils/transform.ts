import { MaskModel } from '../classes';
import { MASK_DEFAULT_OPTIONS } from '../constants';
import type { ElementState, MaskOptions } from '../types/mask-interface';

export function maskTransform(value: string, maskOptions: MaskOptions): string;
export function maskTransform(state: ElementState, maskOptions: MaskOptions): ElementState;

export function maskTransform(valueOrState: ElementState | string, maskOptions: MaskOptions): ElementState | string {
  const options: Required<MaskOptions> = {
    ...MASK_DEFAULT_OPTIONS,
    ...maskOptions,
  };
  const initialElementState: ElementState =
    typeof valueOrState === 'string' ? { value: valueOrState, selection: [0, 0] } : valueOrState;

  const { elementState } = options.preprocessor({ elementState: initialElementState, data: '' }, 'validation');
  const maskModel = new MaskModel(elementState, options);
  const { value, selection } = options.postprocessor(maskModel, initialElementState);

  return typeof valueOrState === 'string' ? value : { value, selection };
}
