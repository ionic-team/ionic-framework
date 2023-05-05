import type { MaskOptions } from '../types/mask-interface';
import { identity } from '../utils';

export const MASK_DEFAULT_OPTIONS: Required<MaskOptions> = {
  mask: /^.*$/,
  preprocessor: identity,
  postprocessor: identity,
  overwriteMode: 'shift',
};
