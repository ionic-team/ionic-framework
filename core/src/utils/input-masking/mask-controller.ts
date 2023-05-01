import { MaskHistory } from "./classes";
import { MASK_DEFAULT_OPTIONS } from "./constants";
import { isBeforeInputEventSupported, isEventProducingCharacter, EventListener } from "./dom";
import type { ElementState, MaskOptions, SelectionRange, TypedInputEvent } from "./types/mask-interface";
import { getLineSelection, getNotEmptySelection, getWordSelection } from "./utils";

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
    this.ensureValueFitsMask();
    this.updateHistory(this.elementState);

    this.eventListener.listen('keydown', event => {
      const { ctrlKey, key, metaKey, shiftKey } = event;

      // CTRL/CMD + z or CTRL + y (Windows shortcut)
      if ((metaKey && shiftKey && key === 'z') || (ctrlKey && key === 'y')) {
        event.preventDefault();

        return this.redo();
      }

      // CTRL/CMD + Z
      if ((ctrlKey || metaKey) && key === 'z') {
        event.preventDefault();

        return this.undo();
      }
    });

    if (isBeforeInputEventSupported(element)) {
      this.eventListener.listen('beforeinput', event => {
        const isForward = event.inputType.includes('Forward');

        this.updateHistory(this.elementState);

        switch (event.inputType) {
          case 'historyUndo':
            event.preventDefault();
            return this.undo();
          case 'historyRedo':
            event.preventDefault();
            return this.redo();
          case 'deleteByCut':
          case 'deleteContentBackward':
          case 'deleteContentForward':
            return this.handleDelete({
              event,
              isForward,
              selection: getNotEmptySelection(this.elementState, isForward)
            });
          case 'deleteWordForward':
          case 'deleteWordBackward':
            return this.handleDelete({
              event,
              isForward,
              selection: getWordSelection(this.elementState, isForward),
              force: true
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
          case 'insertFromDrop':
            // We don't know caret position at this moment
            // (inserted content will be handled later in "input"-event)
            return;
          case 'insertLineBreak':
            return this.handleEnter(event);
          case 'insertFromPaste':
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
      this.eventListener.listen('keydown', event => this.handleKeyDown(event));
      this.eventListener.listen('paste', event => this.handleInsert(
        event,
        event.clipboardData?.getData('text/plain') || ''
      ));
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
        })
      case 'Enter':
        return this.handleEnter(event);
    }

    if (!isEventProducingCharacter(event)) {
      return;
    }

    this.handleInsert(event, pressedKey);
  }

  private ensureValueFitsMask(): void {
    // TODO this.updateElementState(transform(this.elementState, this.options))
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleEnter(_event: Event): void {
    // Stubbed out if we support textarea in the future.
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
