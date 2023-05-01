import { MaskHistory } from "./classes";
import { MASK_DEFAULT_OPTIONS } from "./constants";
import { isBeforeInputEventSupported, isEventProducingCharacter, EventListener } from "./dom";
import type { ElementState, MaskOptions, SelectionRange, TypedInputEvent } from "./types/mask-interface";
import { getNotEmptySelection } from "./utils";

/**
 * The mask controller class. It is used to control the mask of the element.
 *
 * @internal
 *
 * Original design by Tinkoff:
 * @see https://github.com/Tinkoff/maskito/blob/main/projects/core/src/lib/mask.ts
 */
export class MaskController extends MaskHistory {

  private readonly eventListener = new EventListener(this.element);

  private readonly options: Required<MaskOptions> = {
    ...MASK_DEFAULT_OPTIONS,
    ...this.maskOptions,
  }

  constructor(
    private readonly element: HTMLInputElement,
    private readonly maskOptions: MaskOptions
  ) {
    super();
    console.debug('MaskController', {
      element,
      maskOptions,
      options: this.options
    });
    this.ensureValueFitsMask();
    this.updateHistory(this.elementState);

    this.eventListener.listen('keydown', event => {
      console.debug('keydown', event);
    });

    if (isBeforeInputEventSupported(element)) {
      this.eventListener.listen('beforeinput', event => {
        console.debug('beforeinput', event);
      });
    } else {
      /**
       * TODO: Remove once Firefox 87+ is the minimum supported version
       * Also, replace union types `Event | TypedInputEvent` with `TypedInputEvent` inside:
       *** {@link handleDelete}
       *** {@link handleInsert}
       */
      this.eventListener.listen('keydown', event => this.handleKeyDown(event));
      this.eventListener.listen('paste', event => this.handleInsert(
        event,
        event.clipboardData?.getData('text/plain') || ''
      ));
    }

    this.eventListener.listen('input', () => {
      console.debug('input');
    });
  }

  private get elementState(): ElementState {
    const { value, selectionStart, selectionEnd } = this.element;
    return {
      value,
      selection: [selectionStart ?? 0, selectionEnd ?? 0]
    };
  }

  destroy(): void {
    // Remove all event listeners
    this.eventListener.destroy();
  }

  protected updateElementState(
    { value, selection }: ElementState,
    eventInit: Pick<TypedInputEvent, 'data' | 'inputType'> = {
      inputType: 'insertText',
      data: null
    }
  ): void {
    const initialValue = this.elementState.value;

    this.updateValue(value);
    this.updateSelectionRange(selection);

    if (initialValue !== value) {
      this.dispatchInputEvent(eventInit);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const pressedKey = event.key;
    const isForward = pressedKey === 'Delete';

    switch (pressedKey) {
      case 'Backspace':
      case 'Delete':
        return this.handleDelete({
          event,
          isForward,
          selection: getNotEmptySelection(this.elementState, isForward)
        });
    }

    if (!isEventProducingCharacter(event)) {
      return;
    }

    this.handleInsert(event, pressedKey);
  }

  private ensureValueFitsMask(): void {
    // TODO implementation
  }

  private handleDelete({
    event,
    selection,
    isForward,
    force = false
  }: {
    event: Event | TypedInputEvent;
    selection: SelectionRange;
    isForward: boolean;
    force?: boolean
  }): void {
    // TODO implementation
    console.debug('handleDelete', {
      event,
      selection,
      isForward,
      force
    });
  }

  private handleInsert(event: Event | TypedInputEvent, data: string): void {
    // TODO implementation
    console.debug('handleInsert', event, data);
  }

  private updateSelectionRange([from, to]: SelectionRange): void {
    // TODO implementation
    console.debug('updateSelectionRange', [from, to]);
  }

  private updateValue(newValue: string): void {
    // TODO implementation
    console.debug('updateValue', newValue);
  }

  private dispatchInputEvent(
    eventInit: Pick<TypedInputEvent, 'data' | 'inputType'> = {
      inputType: 'insertText',
      data: null
    }
  ): void {
    // TODO implementation
    console.debug('dispatchInputEvent', eventInit);
  }

}
