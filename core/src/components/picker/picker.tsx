import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Listen, Method, Host, h } from '@stencil/core';
import { getElementRoot } from '@utils/helpers';

import type { PickerInternalChangeEventDetail } from './picker-interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 * @internal
 */
@Component({
  tag: 'ion-picker-internal',
  styleUrls: {
    ios: 'picker.ios.scss',
    md: 'picker.md.scss',
  },
  shadow: true,
})
export class PickerInternal implements ComponentInterface {
  private inputEl?: HTMLInputElement;
  private useInputMode = false;
  private inputModeColumn?: HTMLIonPickerColumnInternalElement;
  private highlightEl?: HTMLElement;
  private actionOnClick?: () => void;
  private destroyKeypressListener?: () => void;
  private singleColumnSearchTimeout?: ReturnType<typeof setTimeout>;

  @Element() el!: HTMLIonPickerInternalElement;

  @Event() ionInputModeChange!: EventEmitter<PickerInternalChangeEventDetail>;

  /**
   * When the picker is interacted with
   * we need to prevent touchstart so other
   * gestures do not fire. For example,
   * scrolling on the wheel picker
   * in ion-datetime should not cause
   * a card modal to swipe to close.
   */
  @Listen('touchstart')
  preventTouchStartPropagation(ev: TouchEvent) {
    ev.stopPropagation();
  }

  componentWillLoad() {
    getElementRoot(this.el).addEventListener('focusin', this.onFocusIn);
    getElementRoot(this.el).addEventListener('focusout', this.onFocusOut);
  }

  private isInHighlightBounds = (ev: PointerEvent) => {
    const { highlightEl } = this;
    if (!highlightEl) {
      return false;
    }

    const bbox = highlightEl.getBoundingClientRect();
    /**
     * Check to see if the user clicked
     * outside the bounds of the highlight.
     */
    const outsideX = ev.clientX < bbox.left || ev.clientX > bbox.right;
    const outsideY = ev.clientY < bbox.top || ev.clientY > bbox.bottom;
    if (outsideX || outsideY) {
      return false;
    }

    return true;
  };

  /**
   * If we are no longer focused
   * on a picker column, then we should
   * exit input mode. An exception is made
   * for the input in the picker since having
   * that focused means we are still in input mode.
   */
  private onFocusOut = (ev: any) => {
    // TODO(FW-2832): type
    const { relatedTarget } = ev;

    if (!relatedTarget || (relatedTarget.tagName !== 'ION-PICKER-COLUMN-INTERNAL' && relatedTarget !== this.inputEl)) {
      this.exitInputMode();
    }
  };

  /**
   * When picker columns receive focus
   * the parent picker needs to determine
   * whether to enter/exit input mode.
   */
  private onFocusIn = (ev: any) => {
    // TODO(FW-2832): type
    const { target } = ev;

    /**
     * Due to browser differences in how/when focus
     * is dispatched on certain elements, we need to
     * make sure that this function only ever runs when
     * focusing a picker column.
     */
    if (target.tagName !== 'ION-PICKER-COLUMN-INTERNAL') {
      return;
    }

    /**
     * If we have actionOnClick
     * then this means the user focused
     * a picker column via mouse or
     * touch (i.e. a PointerEvent). As a result,
     * we should not enter/exit input mode
     * until the click event has fired, which happens
     * after the `focusin` event.
     *
     * Otherwise, the user likely focused
     * the column using their keyboard and
     * we should enter/exit input mode automatically.
     */
    if (!this.actionOnClick) {
      const columnEl = target as HTMLIonPickerColumnInternalElement;
      const allowInput = columnEl.numericInput;
      if (allowInput) {
        this.enterInputMode(columnEl, false);
      } else {
        this.exitInputMode();
      }
    }
  };

  /**
   * On click we need to run an actionOnClick
   * function that has been set in onPointerDown
   * so that we enter/exit input mode correctly.
   */
  private onClick = () => {
    const { actionOnClick } = this;
    if (actionOnClick) {
      actionOnClick();
      this.actionOnClick = undefined;
    }
  };

  /**
   * Clicking a column also focuses the column on
   * certain browsers, so we use onPointerDown
   * to tell the onFocusIn function that users
   * are trying to click the column rather than
   * focus the column using the keyboard. When the
   * user completes the click, the onClick function
   * runs and runs the actionOnClick callback.
   */
  private onPointerDown = (ev: PointerEvent) => {
    const { useInputMode, inputModeColumn, el } = this;
    if (this.isInHighlightBounds(ev)) {
      /**
       * If we were already in
       * input mode, then we should determine
       * if we tapped a particular column and
       * should switch to input mode for
       * that specific column.
       */
      if (useInputMode) {
        /**
         * If we tapped a picker column
         * then we should either switch to input
         * mode for that column or all columns.
         * Otherwise we should exit input mode
         * since we just tapped the highlight and
         * not a column.
         */
        if ((ev.target as HTMLElement).tagName === 'ION-PICKER-COLUMN-INTERNAL') {
          /**
           * If user taps 2 different columns
           * then we should just switch to input mode
           * for the new column rather than switching to
           * input mode for all columns.
           */
          if (inputModeColumn && inputModeColumn === ev.target) {
            this.actionOnClick = () => {
              this.enterInputMode();
            };
          } else {
            this.actionOnClick = () => {
              this.enterInputMode(ev.target as HTMLIonPickerColumnInternalElement);
            };
          }
        } else {
          this.actionOnClick = () => {
            this.exitInputMode();
          };
        }
        /**
         * If we were not already in
         * input mode, then we should
         * enter input mode for all columns.
         */
      } else {
        /**
         * If there is only 1 numeric input column
         * then we should skip multi column input.
         */
        const columns = el.querySelectorAll('ion-picker-column-internal.picker-column-numeric-input');
        const columnEl = columns.length === 1 ? (ev.target as HTMLIonPickerColumnInternalElement) : undefined;
        this.actionOnClick = () => {
          this.enterInputMode(columnEl);
        };
      }

      return;
    }

    this.actionOnClick = () => {
      this.exitInputMode();
    };
  };

  /**
   * Enters input mode to allow
   * for text entry of numeric values.
   * If on mobile, we focus a hidden input
   * field so that the on screen keyboard
   * is brought up. When tabbing using a
   * keyboard, picker columns receive an outline
   * to indicate they are focused. As a result,
   * we should not focus the hidden input as it
   * would cause the outline to go away, preventing
   * users from having any visual indication of which
   * column is focused.
   */
  private enterInputMode = (columnEl?: HTMLIonPickerColumnInternalElement, focusInput = true) => {
    const { inputEl, el } = this;
    if (!inputEl) {
      return;
    }

    /**
     * Only active input mode if there is at
     * least one column that accepts numeric input.
     */
    const hasInputColumn = el.querySelector('ion-picker-column-internal.picker-column-numeric-input');
    if (!hasInputColumn) {
      return;
    }

    /**
     * If columnEl is undefined then
     * it is assumed that all numeric pickers
     * are eligible for text entry.
     * (i.e. hour and minute columns)
     */
    this.useInputMode = true;
    this.inputModeColumn = columnEl;

    /**
     * Users with a keyboard and mouse can
     * activate input mode where the input is
     * focused as well as when it is not focused,
     * so we need to make sure we clean up any
     * old listeners.
     */
    if (focusInput) {
      if (this.destroyKeypressListener) {
        this.destroyKeypressListener();
        this.destroyKeypressListener = undefined;
      }

      inputEl.focus();
    } else {
      el.addEventListener('keypress', this.onKeyPress);
      this.destroyKeypressListener = () => {
        el.removeEventListener('keypress', this.onKeyPress);
      };
    }

    this.emitInputModeChange();
  };

  /**
   * @internal
   * Exits text entry mode for the picker
   * This method blurs the hidden input
   * and cause the keyboard to dismiss.
   */
  @Method()
  async exitInputMode() {
    const { inputEl, useInputMode } = this;
    if (!useInputMode || !inputEl) {
      return;
    }

    this.useInputMode = false;
    this.inputModeColumn = undefined;
    inputEl.blur();
    inputEl.value = '';

    if (this.destroyKeypressListener) {
      this.destroyKeypressListener();
      this.destroyKeypressListener = undefined;
    }

    this.emitInputModeChange();
  }

  private onKeyPress = (ev: KeyboardEvent) => {
    const { inputEl } = this;
    if (!inputEl) {
      return;
    }

    const parsedValue = parseInt(ev.key, 10);

    /**
     * Only numbers should be allowed
     */
    if (!Number.isNaN(parsedValue)) {
      inputEl.value += ev.key;

      this.onInputChange();
    }
  };

  private selectSingleColumn = () => {
    const { inputEl, inputModeColumn, singleColumnSearchTimeout } = this;
    if (!inputEl || !inputModeColumn) {
      return;
    }

    const values = inputModeColumn.items.filter((item) => item.disabled !== true);

    /**
     * If users pause for a bit, the search
     * value should be reset similar to how a
     * <select> behaves. So typing "34", waiting,
     * then typing "5" should select "05".
     */
    if (singleColumnSearchTimeout) {
      clearTimeout(singleColumnSearchTimeout);
    }

    this.singleColumnSearchTimeout = setTimeout(() => {
      inputEl.value = '';
      this.singleColumnSearchTimeout = undefined;
    }, 1000);

    /**
     * For values that are longer than 2 digits long
     * we should shift the value over 1 character
     * to the left. So typing "456" would result in "56".
     * TODO: If we want to support more than just
     * time entry, we should update this value to be
     * the max length of all of the picker items.
     */
    if (inputEl.value.length >= 3) {
      const startIndex = inputEl.value.length - 2;
      const newString = inputEl.value.substring(startIndex);

      inputEl.value = newString;
      this.selectSingleColumn();
      return;
    }

    /**
     * Checking the value of the input gets priority
     * first. For example, if the value of the input
     * is "1" and we entered "2", then the complete value
     * is "12" and we should select hour 12.
     *
     * Regex removes any leading zeros from values like "02",
     * but it keeps a single zero if there are only zeros in the string.
     * 0+(?=[1-9]) --> Match 1 or more zeros that are followed by 1-9
     * 0+(?=0$) --> Match 1 or more zeros that must be followed by one 0 and end.
     */
    const findItemFromCompleteValue = values.find(({ text }) => {
      const parsedText = text.replace(/^0+(?=[1-9])|0+(?=0$)/, '');
      return parsedText === inputEl.value;
    });

    if (findItemFromCompleteValue) {
      inputModeColumn.setValue(findItemFromCompleteValue.value);
      return;
    }

    /**
     * If we typed "56" to get minute 56, then typed "7",
     * we should select "07" as "567" is not a valid minute.
     */
    if (inputEl.value.length === 2) {
      const changedCharacter = inputEl.value.substring(inputEl.value.length - 1);
      inputEl.value = changedCharacter;
      this.selectSingleColumn();
    }
  };

  /**
   * Searches a list of column items for a particular
   * value. This is currently used for numeric values.
   * The zeroBehavior can be set to account for leading
   * or trailing zeros when looking at the item text.
   */
  private searchColumn = (
    colEl: HTMLIonPickerColumnInternalElement,
    value: string,
    zeroBehavior: 'start' | 'end' = 'start'
  ) => {
    const behavior = zeroBehavior === 'start' ? /^0+/ : /0$/;
    const item = colEl.items.find(({ text, disabled }) => disabled !== true && text.replace(behavior, '') === value);

    if (item) {
      colEl.setValue(item.value);
    }
  };

  private selectMultiColumn = () => {
    const { inputEl, el } = this;
    if (!inputEl) {
      return;
    }

    const numericPickers = Array.from(el.querySelectorAll('ion-picker-column-internal')).filter(
      (col) => col.numericInput
    );

    const firstColumn = numericPickers[0];
    const lastColumn = numericPickers[1];

    let value = inputEl.value;
    let minuteValue;
    switch (value.length) {
      case 1:
        this.searchColumn(firstColumn, value);
        break;
      case 2:
        /**
         * If the first character is `0` or `1` it is
         * possible that users are trying to type `09`
         * or `11` into the hour field, so we should look
         * at that first.
         */
        const firstCharacter = inputEl.value.substring(0, 1);
        value = firstCharacter === '0' || firstCharacter === '1' ? inputEl.value : firstCharacter;

        this.searchColumn(firstColumn, value);

        /**
         * If only checked the first value,
         * we can check the second value
         * for a match in the minutes column
         */
        if (value.length === 1) {
          minuteValue = inputEl.value.substring(inputEl.value.length - 1);
          this.searchColumn(lastColumn, minuteValue, 'end');
        }
        break;
      case 3:
        /**
         * If the first character is `0` or `1` it is
         * possible that users are trying to type `09`
         * or `11` into the hour field, so we should look
         * at that first.
         */
        const firstCharacterAgain = inputEl.value.substring(0, 1);
        value =
          firstCharacterAgain === '0' || firstCharacterAgain === '1'
            ? inputEl.value.substring(0, 2)
            : firstCharacterAgain;

        this.searchColumn(firstColumn, value);

        /**
         * If only checked the first value,
         * we can check the second value
         * for a match in the minutes column
         */
        minuteValue = value.length === 1 ? inputEl.value.substring(1) : inputEl.value.substring(2);

        this.searchColumn(lastColumn, minuteValue, 'end');
        break;
      case 4:
        /**
         * If the first character is `0` or `1` it is
         * possible that users are trying to type `09`
         * or `11` into the hour field, so we should look
         * at that first.
         */
        const firstCharacterAgainAgain = inputEl.value.substring(0, 1);
        value =
          firstCharacterAgainAgain === '0' || firstCharacterAgainAgain === '1'
            ? inputEl.value.substring(0, 2)
            : firstCharacterAgainAgain;
        this.searchColumn(firstColumn, value);

        /**
         * If only checked the first value,
         * we can check the second value
         * for a match in the minutes column
         */
        const minuteValueAgain =
          value.length === 1
            ? inputEl.value.substring(1, inputEl.value.length)
            : inputEl.value.substring(2, inputEl.value.length);
        this.searchColumn(lastColumn, minuteValueAgain, 'end');

        break;
      default:
        const startIndex = inputEl.value.length - 4;
        const newString = inputEl.value.substring(startIndex);

        inputEl.value = newString;
        this.selectMultiColumn();
        break;
    }
  };

  /**
   * Searches the value of the active column
   * to determine which value users are trying
   * to select
   */
  private onInputChange = () => {
    const { useInputMode, inputEl, inputModeColumn } = this;
    if (!useInputMode || !inputEl) {
      return;
    }

    if (inputModeColumn) {
      this.selectSingleColumn();
    } else {
      this.selectMultiColumn();
    }
  };

  /**
   * Emit ionInputModeChange. Picker columns
   * listen for this event to determine whether
   * or not their column is "active" for text input.
   */
  private emitInputModeChange = () => {
    const { useInputMode, inputModeColumn } = this;

    this.ionInputModeChange.emit({
      useInputMode,
      inputModeColumn,
    });
  };

  render() {
    return (
      <Host onPointerDown={(ev: PointerEvent) => this.onPointerDown(ev)} onClick={() => this.onClick()}>
        <input
          aria-hidden="true"
          tabindex={-1}
          inputmode="numeric"
          type="number"
          ref={(el) => (this.inputEl = el)}
          onInput={() => this.onInputChange()}
          onBlur={() => this.exitInputMode()}
        />
        <div class="picker-before"></div>
        <div class="picker-after"></div>
        <div class="picker-highlight" ref={(el) => (this.highlightEl = el)}></div>
        <slot></slot>
      </Host>
    );
  }
}
