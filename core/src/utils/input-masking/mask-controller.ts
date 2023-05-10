import { MaskHistory, MaskModel } from './classes';
import { MASK_DEFAULT_OPTIONS } from './constants';
import { isBeforeInputEventSupported, isEventProducingCharacter, EventListener } from './dom';
import type { ElementState, MaskOptions, SelectionRange, TypedInputEvent } from './types/mask-interface';
import { areElementValuesEqual, getLineSelection, getNotEmptySelection, getWordSelection } from './utils';
import { maskTransform } from './utils/transform';

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
  };

  constructor(private readonly element: HTMLInputElement, private readonly maskOptions: MaskOptions) {
    super();
    this.ensureValueFitsMask();
    this.updateHistory(this.elementState);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.eventListener.listen('keydown', (_event) => {
      // TODO handle undo and redo
    });

    if (isBeforeInputEventSupported(element)) {
      this.eventListener.listen('beforeinput', (event) => {
        const isForward = event.inputType.includes('Forward');

        this.updateHistory(this.elementState);

        switch (event.inputType) {
          case 'deleteByCut':
          case 'deleteContentBackward':
          case 'deleteContentForward':
            return this.handleDelete({
              event,
              isForward,
              selection: getNotEmptySelection(this.elementState, isForward),
            });
          case 'deleteWordForward':
          case 'deleteWordBackward':
            return this.handleDelete({
              event,
              isForward,
              selection: getWordSelection(this.elementState, isForward),
              force: true,
            });
          case 'deleteSoftLineBackward':
          case 'deleteSoftLineForward':
          case 'deleteHardLineBackward':
          case 'deleteHardLineForward':
            return this.handleDelete({
              event,
              isForward,
              selection: getLineSelection(this.elementState, isForward),
              force: true,
            });
          case 'insertText':
          default:
            return this.handleInsert(event, event.data || '');
        }
      });
    } else {
      /**
       * TODO: Remove once Firefox 87+ is the minimum supported version
       * Also, replace union types `Event | TypedInputEvent` with `TypedInputEvent` inside:
       *** {@link handleDelete}
       *** {@link handleInsert}
       */
      this.eventListener.listen('keydown', (event) => this.handleKeyDown(event));
      this.eventListener.listen('paste', (event) =>
        this.handleInsert(event, event.clipboardData?.getData('text/plain') || '')
      );
    }

    this.eventListener.listen('input', () => {
      this.ensureValueFitsMask();
      this.updateHistory(this.elementState);
    });
  }

  private get elementState(): ElementState {
    const { value, selectionStart, selectionEnd } = this.element;
    return {
      value,
      selection: [selectionStart ?? 0, selectionEnd ?? 0],
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
      data: null,
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
          selection: getNotEmptySelection(this.elementState, isForward),
        });
    }

    if (!isEventProducingCharacter(event)) {
      return;
    }

    this.handleInsert(event, pressedKey);
  }

  private ensureValueFitsMask(): void {
    this.updateElementState(maskTransform(this.elementState, this.options));
  }

  private handleDelete({
    event,
    selection,
    isForward,
    force = false,
  }: {
    event: Event | TypedInputEvent;
    selection: SelectionRange;
    isForward: boolean;
    force?: boolean;
  }): void {
    const initialState: ElementState = {
      value: this.elementState.value,
      selection,
    };
    const [initialFrom, initialTo] = initialState.selection;
    const { elementState } = this.options.preprocessor(
      {
        elementState: initialState,
        data: '',
      },
      isForward ? 'deleteForward' : 'deleteBackward',
    );
    const maskModel = new MaskModel(elementState, this.options);
    const [from, to] = elementState.selection;

    maskModel.deleteCharacters([from, to]);

    const newElementState = this.options.postprocessor(maskModel, initialState);
    const newPossibleValue =
      initialState.value.slice(0, initialFrom) +
      initialState.value.slice(initialTo);

    if (newPossibleValue === newElementState.value && !force) {
      return;
    }

    event.preventDefault();

    if (areElementValuesEqual(initialState, elementState, maskModel, newElementState)) {
      // User presses Backspace/Delete for the fixed value
      return this.updateSelectionRange(isForward ? [to, to] : [from, from]);
    }

    // TODO: drop it when `event: Event | TypedInputEvent` => `event: TypedInputEvent`
    const inputTypeFallback = isForward
      ? 'deleteContentForward'
      : 'deleteContentBackward';

    this.updateElementState(newElementState, {
      inputType: 'inputType' in event ? event.inputType : inputTypeFallback,
      data: null,
    });
    this.updateHistory(newElementState);
  }

  private handleInsert(event: Event | TypedInputEvent, data: string): void {
    // Store the initial element state before processing the input.
    const initialElementState = this.elementState;

    // Preprocess the input using the preprocessor function.
    const { elementState, data: insertedText = data } = this.options.preprocessor(
      {
        data,
        elementState: initialElementState,
      },
      'insert'
    );

    // Create a new MaskModel object and attempt to add new characters to the input.
    const maskModel = new MaskModel(elementState, this.options);
    try {
      maskModel.addCharacters(elementState.selection, insertedText);
    } catch {
      // If adding new characters fails, prevent the default behavior of the input event.
      return event.preventDefault();
    }

    // Compute the new input value and element state after adding the new characters.
    const [from, to] = elementState.selection;
    const newPossibleValue = elementState.value.slice(0, from) + data + elementState.value.slice(to);

    // Postprocess the input using the postprocessor function.
    const newElementState = this.options.postprocessor(maskModel, initialElementState);

    // If the new input value is different from the computed value, update the input element and history.
    if (newPossibleValue !== newElementState.value) {
      event.preventDefault();

      // Update the element state and trigger a new input event with updated data.
      this.updateElementState(newElementState, {
        data,
        inputType: 'inputType' in event ? event.inputType : 'insertText',
      });
      this.updateHistory(newElementState);
    }
  }

  private updateSelectionRange([from, to]: SelectionRange): void {
    const { element } = this;
    if (element.selectionStart !== from || element.selectionEnd !== to) {
      element.setSelectionRange?.(from, to);
    }
  }

  private updateValue(newValue: string): void {
    if (this.element.value !== newValue) {
      this.element.value = newValue;
    }
  }

  private dispatchInputEvent(
    eventInit: Pick<TypedInputEvent, 'data' | 'inputType'> = {
      inputType: 'insertText',
      data: null,
    }
  ): void {
    if (globalThis?.InputEvent !== undefined) {
      this.element.dispatchEvent(
        new InputEvent('input', {
          ...eventInit,
          bubbles: true,
          cancelable: false,
        })
      );
    }
  }
}
