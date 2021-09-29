import { Component, ComponentInterface, Element, Event, EventEmitter, Host, h } from '@stencil/core';

import { getElementRoot } from '../../utils/helpers';

import { PickerInternalChangeEventDetail } from './picker-internal-interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 * @internal
 */
@Component({
  tag: 'ion-picker-internal',
  styleUrls: {
    ios: 'picker-internal.ios.scss',
    md: 'picker-internal.md.scss'
  },
  shadow: true
})
export class PickerInternal implements ComponentInterface {
  private inputEl?: HTMLInputElement;
  private inputMode = false;
  private inputModeColumn?: HTMLIonPickerColumnInternalElement;
  private highlightEl?: HTMLElement;
  private actionOnClick?: () => void;
  private destroyKeypressListener?: () => void;

  @Element() el!: HTMLIonPickerInternalElement;

  @Event() ionInputModeChange!: EventEmitter<PickerInternalChangeEventDetail>;

  componentWillLoad() {
    getElementRoot(this.el).addEventListener('focusin', this.onFocusIn);
    getElementRoot(this.el).addEventListener('focusout', this.onFocusOut);
  }

  private isInHighlightBounds = (ev: PointerEvent) => {
    const { highlightEl } = this;
    if (!highlightEl) { return false; }

    const bbox = highlightEl.getBoundingClientRect();
    /**
     * Check to see if the x-axis of where
     * user clicked is out of bounds. This means
     * that the user did not click on an area covered
     * by the highlight.
     */
    if (ev.clientX < bbox.left || ev.clientX > bbox.right) { return false; }

    /**
     * Check to see if the x-axis of where
     * user clicked is out of bounds. This means
     * that the user did not click on an area covered
     * by the highlight.
     */
    if (ev.clientY < bbox.top || ev.clientY > bbox.bottom) { return false; }

    return true;
  }

  /**
   * If we are no longer focused
   * on a picker column, then we should
   * exit input mode. An exception is made
   * for the input in the picker since having
   * that focused means we are still in input mode.
   */
  private onFocusOut = (ev: any) => {
    const { relatedTarget } = ev;

    if (
      !relatedTarget ||
      relatedTarget.tagName !== 'ION-PICKER-COLUMN-INTERNAL' && relatedTarget !== this.inputEl
    ) {
      this.exitInputMode();
    }
  }

  /**
   * When picker columns receive focus
   * the parent picker needs to determine
   * whether to enter/exit input mode.
   */
  private onFocusIn = (ev: any) => {
    const { target } = ev;

    /**
     * Due to browser differences in how/when focus
     * is dispatched on certain elements, we need to
     * make sure that this function only ever runs when
     * focusing a picker column.
     */
    if (target.tagName !== 'ION-PICKER-COLUMN-INTERNAL') { return; }

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
  }

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
  }

  private onPointerDown = (ev: PointerEvent) => {
    const { inputMode, inputModeColumn } = this;
    if (this.isInHighlightBounds(ev)) {
      /**
       * If we were already in
       * input mode, then we should determine
       * if we tapped a particular column and
       * should switch to input mode for
       * that specific column.
       */
      if (inputMode) {
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
            }
          } else {
            this.actionOnClick = () => {
              this.enterInputMode(ev.target as HTMLIonPickerColumnInternalElement);
            }
          }
        } else {
          this.actionOnClick = () => {
            this.exitInputMode();
          }
        }
      /**
       * If we were not already in
       * input mode, then we should
       * enter input mode for all columns.
       */
      } else {
        this.actionOnClick = () => {
          this.enterInputMode();
        }
      }

      return;
    }

    this.actionOnClick = () => {
      this.exitInputMode();
    }
  }

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
    if (!inputEl) { return; }

    /**
     * If columnEl is undefined then
     * it is assumed that all numeric pickers
     * are eligible for text entry.
     * (i.e. hour and minute columns)
     */
    this.inputMode = true;
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
      }
    }

    this.emitInputModeChange();
  }

  private exitInputMode = () => {
    const { inputEl, inputMode } = this;
    if (!inputMode || !inputEl) { return; }

    this.inputMode = false;
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
    if (!inputEl) { return; }

    const parsedValue = parseInt(ev.key, 10);

    /**
     * Only numbers should be allowed
     */
    if (!Number.isNaN(parsedValue)) {
      inputEl.value += ev.key;

      this.onInputChange()
    }
  }

  private selectSingleColumn = () => {
    const { inputEl, inputModeColumn } = this;
    if (!inputEl || !inputModeColumn) { return; }

    const values = inputModeColumn.items;
    let valueToSelect;

    /**
     * Checking the value of the input gets priority
     * first. For example, if the value of the input
     * is "1" and we entered "2", then the complete value
     * is "12" and we should select hour 12.
     */
    const findItemFromCompleteValue = values.find(v => v.text === inputEl.value);
    if (findItemFromCompleteValue) {
      valueToSelect = findItemFromCompleteValue.value;
    /**
     * On the other hand, if the value of the
     * input is "4" and we type "9", then we should
     * just search on the "9" value because
     * there is no 49th hour. In other words, if we
     * cannot find a value using the complete input value
     * then fall back to just checking on the most recent
     * character entered.
     */
    } else {
      const changedCharacter = inputEl.value.substring(inputEl.value.length - 1);

      /**
       * Match `05` first, allowing users to
       * then type `6` to match `56`.
       */
      const findItemFromSingleValue = values.find(v => v.text === `0${changedCharacter}` || v.text === changedCharacter);

      /**
       * If we found a value, then we should update the
       * input value to be that single character. So if the value
       * of the input was "8" and we typed "1", the picker
       * should select hour "1". From there, we should be able
       * to type "2" to have the picker select hour "12".
       */
      if (findItemFromSingleValue) {
        inputEl.value = changedCharacter;
        valueToSelect = findItemFromSingleValue.value;
      }
    }

    /**
     * If we found a value then we
     * need to set the picker column
     * value so the selection is
     * reflected in the UI.
     */
    if (valueToSelect !== undefined) {
      inputModeColumn.value = valueToSelect;
    }
  }

  private searchHourColumn = (colEl: HTMLIonPickerColumnInternalElement, value: string) => {
    const item = colEl.items.find(v => {
      return (
        v.text === `0${value}` ||
        v.text === value
      )
    });

    if (item) {
      colEl.value = item.value;
    }
  }

  private searchMinuteColumn = (colEl: HTMLIonPickerColumnInternalElement, value: string) => {
    const item = colEl.items.find(v => {
      return (
        v.text === `${value}0` ||
        v.text === value
      )
    });

    if (item) {
      colEl.value = item.value;
    }
  }

  private selectMultiColumn = () => {
    const { inputEl, el } = this;
    if (!inputEl) { return; }

    const numericPickers = Array.from(el.querySelectorAll('ion-picker-column-internal')).filter(col => col.numericInput);

    const firstColumn = numericPickers[0];
    const lastColumn = numericPickers[1];

    let value = inputEl.value;
    switch (value.length) {
      case 1:
        this.searchHourColumn(firstColumn, value);
        break;
      case 2:
        /**
         * If the first character is `0` or `1` it is
         * possible that users are trying to type `09`
         * or `11` into the hour field, so we should look
         * at that first.
         */
        const firstCharacter = inputEl.value.substring(0, 1);
        value = (firstCharacter === '0' || firstCharacter === '1') ? inputEl.value : firstCharacter;

        this.searchHourColumn(firstColumn, value);

        /**
         * If only checked the first value,
         * we can check the second value
         * for a match in the minutes column
         */
        if (value.length === 1) {
          const minuteValue = inputEl.value.substring(inputEl.value.length - 1);
          this.searchMinuteColumn(lastColumn, minuteValue);
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
        value = (firstCharacterAgain === '0' || firstCharacterAgain === '1') ? inputEl.value.substring(0, 2) : firstCharacterAgain;

        this.searchHourColumn(firstColumn, value);

        /**
         * If only checked the first value,
         * we can check the second value
         * for a match in the minutes column
         */
        const minuteValue = (value.length === 1) ? inputEl.value.substring(1) : inputEl.value.substring(2);

        this.searchMinuteColumn(lastColumn, minuteValue);
        break;
      case 4:
        /**
         * If the first character is `0` or `1` it is
         * possible that users are trying to type `09`
         * or `11` into the hour field, so we should look
         * at that first.
         */
        const firstCharacterAgainAgain = inputEl.value.substring(0, 1);
        value = (firstCharacterAgainAgain === '0' || firstCharacterAgainAgain === '1') ? inputEl.value.substring(0, 2) : firstCharacterAgainAgain;
        this.searchHourColumn(firstColumn, value);

        /**
         * If only checked the first value,
         * we can check the second value
         * for a match in the minutes column
         */
        const minuteValueAgain = (value.length === 1) ? inputEl.value.substring(1, inputEl.value.length) : inputEl.value.substring(2, inputEl.value.length);
        this.searchMinuteColumn(lastColumn, minuteValueAgain);

        break;
      default:
        const startIndex = inputEl.value.length - 4;
        const newString = inputEl.value.substring(startIndex);

        inputEl.value = newString;
        this.selectMultiColumn();
        break;
    }
  }

  /**
   * Searches the value of the active column
   * to determine which value users are trying
   * to select
   */
  private onInputChange = () => {
    const { inputMode, inputEl, inputModeColumn } = this;
    if (!inputMode || !inputEl) { return; }

    if (inputModeColumn) {
      this.selectSingleColumn();
    } else {
      this.selectMultiColumn();
    }
  }

  /**
   * Emit ionInputModeChange. Picker columns
   * listen for this event to determine whether
   * or not their column is "active" for text input.
   */
  private emitInputModeChange = () => {
    const { inputMode, inputModeColumn } = this;

    this.ionInputModeChange.emit({
      inputMode,
      inputModeColumn
    });
  }

  render() {
    return (
      <Host
        onPointerDown={(ev: PointerEvent) => this.onPointerDown(ev)}
        onClick={() => this.onClick()}
      >
        <input
          tabindex={-1}
          inputmode="numeric"
          type="number"
          ref={el => this.inputEl = el}
          onInput={() => this.onInputChange()}
          onBlur={() => this.exitInputMode()}
        />
        <div class="picker-before"></div>
        <div class="picker-after"></div>
        <div class="picker-highlight" ref={el => this.highlightEl = el}></div>
        <slot></slot>
      </Host>
    );
  }
}
