export interface PickerColumnItem {
  text: string;
  value: string | number;
  /**
   * The optional aria-label text to be read by screen readers.
   * If not specified, the text will be read.
   */
  ariaLabel?: string;
  disabled?: boolean;
}
