import type { ElementState, TypedInputEvent } from '../types/mask-interface';

/**
 * The mask history class. It is used to store the previous and next states of the element.
 * @internal
 *
 * Original design by Tinkoff:
 * @see https://github.com/Tinkoff/maskito/blob/main/projects/core/src/lib/classes/mask-history.ts
 */
export abstract class MaskHistory {
  private now: ElementState | null = null;
  private readonly past: ElementState[] = [];
  private future: ElementState[] = [];

  protected abstract updateElementState(
    state: ElementState,
    eventInit: Pick<TypedInputEvent, 'data' | 'inputType'>
  ): void;

  protected undo(): void {
    const state = this.past.pop();

    if (state && this.now) {
      this.future.push(this.now);
      this.updateElement(state, 'historyUndo');
    }
  }

  protected redo(): void {
    const state = this.future.pop();

    if (state && this.now) {
      this.past.push(this.now);
      this.updateElement(state, 'historyRedo');
    }
  }

  protected updateHistory(state: ElementState): void {
    if (!this.now) {
      this.now = state;
      return;
    }

    const isValueChanged = this.now.value !== state.value;
    const isSelectionChanged = this.now.selection.some((item, index) => item !== state.selection[index]);

    if (!isValueChanged && !isSelectionChanged) {
      return;
    }

    if (isValueChanged) {
      this.past.push(this.now);
      this.future = [];
    }

    this.now = state;
  }

  private updateElement(state: ElementState, inputType: TypedInputEvent['inputType']): void {
    this.now = state;
    this.updateElementState(state, { inputType, data: null });
  }
}
