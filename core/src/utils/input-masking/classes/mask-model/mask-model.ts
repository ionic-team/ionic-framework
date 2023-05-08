import type { ElementState, MaskExpression, MaskOptions, SelectionRange } from '../../types/mask-interface';
import { areElementStatesEqual } from '../../utils';

import { applyOverwriteMode } from './utils/apply-overwrite-mode';
import { calibrateValueByMask } from './utils/calibrate-value-by-mask';
import { removeFixedMaskCharacters } from './utils/remove-fixed-mask-characters';

export class MaskModel implements ElementState {
  value = '';
  selection: SelectionRange = [0, 0];

  constructor(readonly initialElementState: ElementState, private readonly maskOptions: Required<MaskOptions>) {
    const { value, selection } = calibrateValueByMask(initialElementState, this.getMaskExpression(initialElementState));

    this.value = value;
    this.selection = selection;
  }

  /**
   * Inserts new characters into the input value at the specified selection range.
   *
   * @param selectionRange - An array containing the start and end indices of the selection range where new characters should be inserted.
   * @param newCharacters - The string of new characters to insert into the input value.
   * @throws An error if the resulting masked value is invalid or the new characters do not change the value.
   */
  addCharacters([from, to]: SelectionRange, newCharacters: string): void {
    const { value } = this;

    // Get the mask expression for the updated value with the new characters inserted.
    const maskExpression = this.getMaskExpression({
      value: value.slice(0, from) + newCharacters + value.slice(to),
      selection: [from + newCharacters.length, from + newCharacters.length],
    });

    // Create an initial element state with the original value and selection.
    const initialElementState = { value, selection: [from, to] } as ElementState;

    // Remove fixed mask characters from the value within the selection range.
    const unmaskedElementState = removeFixedMaskCharacters(initialElementState, maskExpression);

    // Apply the overwrite mode to the new characters and get the updated selection range within the unmasked value.
    const [unmaskedFrom, unmaskedTo] = applyOverwriteMode(
      unmaskedElementState,
      newCharacters,
      this.maskOptions.overwriteMode
    ).selection;

    // Create a new unmasked value with the new characters inserted.
    const newUnmaskedLeadingValuePart = unmaskedElementState.value.slice(0, unmaskedFrom) + newCharacters;

    // Set the new caret index to the end of the new leading value part.
    const newCaretIndex = newUnmaskedLeadingValuePart.length;

    // Calibrate the new unmasked value by the mask expression to get the new masked value and selection.
    const maskedElementState = calibrateValueByMask(
      {
        value: newUnmaskedLeadingValuePart + unmaskedElementState.value.slice(unmaskedTo),
        selection: [newCaretIndex, newCaretIndex],
      },
      maskExpression,
      initialElementState
    );

    // Check if the insertion of new characters is invalid.
    const isInvalidCharsInsertion =
      value.slice(0, unmaskedFrom) ===
      calibrateValueByMask(
        {
          value: newUnmaskedLeadingValuePart,
          selection: [newCaretIndex, newCaretIndex],
        },
        maskExpression,
        initialElementState
      ).value;

    // Throw an error if the insertion is invalid or the new characters do not change the value.
    if (isInvalidCharsInsertion || areElementStatesEqual(this, maskedElementState)) {
      throw new Error('Invalid mask value');
    }

    // Set the component's value and selection to the masked value and selection.
    this.value = maskedElementState.value;
    this.selection = maskedElementState.selection;
  }

  /**
   * Deletes characters from the input value within the given selection range.
   * The characters to be deleted are replaced with empty space characters.
   *
   * @param selectionRange - An array containing the start and end indices of the text to delete.
   */
  deleteCharacters([from, to]: SelectionRange): void {
    // If the selection range is empty or undefined, do nothing.
    if (from === to || to === undefined) {
      return;
    }

    const { value } = this;

    // Get the mask expression for the updated value with the selected text deleted.
    const maskExpression = this.getMaskExpression({
      value: value.slice(0, from) + value.slice(to),
      selection: [from, from],
    });

    // Create an initial element state with the original value and selection.
    const initialElementState = { value, selection: [from, to] } as ElementState;

    // Remove fixed mask characters from the value within the selection range.
    const unmaskedElementState = removeFixedMaskCharacters(initialElementState, maskExpression);

    // Get the new selection range within the unmasked value.
    const [unmaskedFrom, unmaskedTo] = unmaskedElementState.selection;

    // Create a new unmasked value within selected text deleted.
    const newUnmaskedValue =
      unmaskedElementState.value.slice(0, unmaskedFrom) + unmaskedElementState.value.slice(unmaskedTo);

    // Calibrate the unmasked value by the mask expression to get the final masked value.
    const maskedElementState = calibrateValueByMask(
      { value: newUnmaskedValue, selection: [unmaskedFrom, unmaskedFrom] },
      maskExpression,
      initialElementState
    );

    // Set the component's value and selection to the masked value and selection.
    this.value = maskedElementState.value;
    this.selection = maskedElementState.selection;
  }

  private getMaskExpression(elementState: ElementState): MaskExpression {
    const { mask } = this.maskOptions;
    /**
     * Ionic Framework does not currently allow developers to use
     * a function as a mask, e.g.: (elementState) => maskExpression.
     *
     * However, we are keeping this code here for future reference.
     */
    return typeof mask === 'function' ? mask(elementState) : mask;
  }
}
