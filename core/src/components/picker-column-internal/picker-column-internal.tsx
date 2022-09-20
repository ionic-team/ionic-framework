import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';
import { getElementRoot, raf } from '../../utils/helpers';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from '../../utils/native/haptic';
import { createColorClasses } from '../../utils/theme';
import type { PickerInternalCustomEvent } from '../picker-internal/picker-internal-interfaces';

import type { PickerColumnItem } from './picker-column-internal-interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 * @internal
 */
@Component({
  tag: 'ion-picker-column-internal',
  styleUrls: {
    ios: 'picker-column-internal.ios.scss',
    md: 'picker-column-internal.md.scss',
  },
  shadow: true,
})
export class PickerColumnInternal implements ComponentInterface {
  private destroyScrollListener?: () => void;
  private isScrolling = false;
  private scrollEndCallback?: () => void;
  private isColumnVisible = false;

  @State() isActive = false;

  @Element() el!: HTMLIonPickerColumnInternalElement;

  /**
   * A list of options to be displayed in the picker
   */
  @Prop() items: PickerColumnItem[] = [];
  @Watch('items')
  itemsChange(currentItems: PickerColumnItem[], previousItems: PickerColumnItem[]) {
    const { value } = this;

    /**
     * When the items change, it is possible for the item
     * that was selected to no longer exist. In that case, we need
     * to automatically select the nearest item. If we do not,
     * then the scroll position will be reset to zero and it will
     * look like the first item was automatically selected.
     *
     * If we cannot find a closest item then we do nothing, and
     * the browser will reset the scroll position to 0.
     */
    const findCurrentItem = currentItems.find((item) => item.value === value);
    if (!findCurrentItem) {
      /**
       * The default behavior is to assume
       * that the new set of data is similar to the old
       * set of data, just with some items filtered out.
       * We walk backwards through the data to find the
       * closest enabled picker item and select it.
       *
       * Developers can also swap the items out for an entirely
       * new set of data. In that case, the value we select
       * here likely will not make much sense. For this use case,
       * developers should update the `value` prop themselves
       * when swapping out the data.
       */
      const findPreviousItemIndex = previousItems.findIndex((item) => item.value === value);
      if (findPreviousItemIndex === -1) {
        return;
      }

      /**
       * Step through the current items backwards
       * until we find a neighbor we can select.
       * We start at the last known location of the
       * current selected item in order to
       * account for data that has been added. This
       * search prioritizes stability in that it
       * tries to keep the scroll position as close
       * to where it was before the update.
       * Before Items: ['a', 'b', 'c'], Selected Value: 'b'
       * After Items:  ['a', 'dog', 'c']
       * Even though 'dog' is a different item than 'b',
       * it is the closest item we can select while
       * preserving the scroll position.
       */
      let nearestItem;
      for (let i = findPreviousItemIndex; i >= 0; i--) {
        const item = currentItems[i];
        if (item !== undefined && item.disabled !== true) {
          nearestItem = item;
          break;
        }
      }

      if (nearestItem) {
        this.setValue(nearestItem.value);
        return;
      }
    }
  }

  /**
   * The selected option in the picker.
   */
  @Prop({ mutable: true }) value?: string | number;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color = 'primary';

  /**
   * If `true`, tapping the picker will
   * reveal a number input keyboard that lets
   * the user type in values for each picker
   * column. This is useful when working
   * with time pickers.
   *
   * @internal
   */
  @Prop() numericInput = false;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<PickerColumnItem>;

  @Watch('value')
  valueChange() {
    if (this.isColumnVisible) {
      /**
       * Only scroll the active item into view when the picker column
       * is actively visible to the user.
       */
      this.scrollActiveItemIntoView();
      this.focusActiveItem();
    }
  }

  /**
   * Only setup scroll listeners
   * when the picker is visible, otherwise
   * the container will have a scroll
   * height of 0px.
   */
  componentWillLoad() {
    const visibleCallback = (entries: IntersectionObserverEntry[]) => {
      const ev = entries[0];

      if (ev.isIntersecting) {
        this.isColumnVisible = true;
        /**
         * Because this initial call to scrollActiveItemIntoView has to fire before
         * the scroll listener is set up, we need to manage the active class manually.
         */
        const oldActive = getElementRoot(this.el).querySelector(`.${PICKER_COL_ACTIVE}`);
        oldActive?.classList.remove(PICKER_COL_ACTIVE);
        this.scrollActiveItemIntoView();
        this.activeItem?.classList.add(PICKER_COL_ACTIVE);

        this.initializeScrollListener();
      } else {
        this.isColumnVisible = false;

        if (this.destroyScrollListener) {
          this.destroyScrollListener();
          this.destroyScrollListener = undefined;
        }
      }
    };
    new IntersectionObserver(visibleCallback, { threshold: 0.001 }).observe(this.el);

    const parentEl = this.el.closest('ion-picker-internal') as HTMLIonPickerInternalElement | null;
    if (parentEl !== null) {
      parentEl.addEventListener('ionInputModeChange', (ev: any) => this.inputModeChange(ev));
    }
  }

  componentDidRender() {
    const { activeItem, items, isColumnVisible, value } = this;

    if (isColumnVisible) {
      if (activeItem) {
        this.scrollActiveItemIntoView();
      } else if (items[0]?.value !== value) {
        /**
         * If the picker column does not have an active item and the current value
         * does not match the first item in the picker column, that means
         * the value is out of bounds. In this case, we assign the value to the
         * first item to match the scroll position of the column.
         *
         */
        this.setValue(items[0].value);
      }
    }
  }

  /** @internal  */
  @Method()
  async scrollActiveItemIntoView() {
    const activeEl = this.activeItem;

    if (activeEl) {
      this.centerPickerItemInView(activeEl, false);
    }
  }

  /**
   * Sets the value prop and fires the ionChange event.
   * This is used when we need to fire ionChange from
   * user-generated events that cannot be caught with normal
   * input/change event listeners.
   * @internal
   */
  @Method()
  async setValue(value?: string | number) {
    const { items } = this;
    this.value = value;
    const findItem = items.find((item) => item.value === value && item.disabled !== true);
    if (findItem) {
      this.ionChange.emit(findItem);
    }
  }

  private centerPickerItemInView = (target: HTMLElement, smooth = true) => {
    const { el, isColumnVisible } = this;
    if (isColumnVisible) {
      // (Vertical offset from parent) - (three empty picker rows) + (half the height of the target to ensure the scroll triggers)
      const top = target.offsetTop - 3 * target.clientHeight + target.clientHeight / 2;

      if (el.scrollTop !== top) {
        el.scroll({
          top,
          left: 0,
          behavior: smooth ? 'smooth' : undefined,
        });
      }
    }
  };

  /**
   * When ionInputModeChange is emitted, each column
   * needs to check if it is the one being made available
   * for text entry.
   */
  private inputModeChange = (ev: PickerInternalCustomEvent) => {
    if (!this.numericInput) {
      return;
    }

    const { useInputMode, inputModeColumn } = ev.detail;

    /**
     * If inputModeColumn is undefined then this means
     * all numericInput columns are being selected.
     */
    const isColumnActive = inputModeColumn === undefined || inputModeColumn === this.el;

    if (!useInputMode || !isColumnActive) {
      this.setInputModeActive(false);
      return;
    }

    this.setInputModeActive(true);
  };

  /**
   * Setting isActive will cause a re-render.
   * As a result, we do not want to cause the
   * re-render mid scroll as this will cause
   * the picker column to jump back to
   * whatever value was selected at the
   * start of the scroll interaction.
   */
  private setInputModeActive = (state: boolean) => {
    if (this.isScrolling) {
      this.scrollEndCallback = () => {
        this.isActive = state;
      };
      return;
    }

    this.isActive = state;
  };

  /**
   * When the column scrolls, the component
   * needs to determine which item is centered
   * in the view and will emit an ionChange with
   * the item object.
   */
  private initializeScrollListener = () => {
    const { el } = this;

    let timeout: any;
    let activeEl: HTMLElement | null = this.activeItem;

    const scrollCallback = () => {
      raf(() => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }

        if (!this.isScrolling) {
          hapticSelectionStart();
          this.isScrolling = true;
        }

        /**
         * Select item in the center of the column
         * which is the month/year that we want to select
         */
        const bbox = el.getBoundingClientRect();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;

        const activeElement = el.shadowRoot!.elementFromPoint(centerX, centerY) as HTMLButtonElement;
        if (activeEl !== null) {
          activeEl.classList.remove(PICKER_COL_ACTIVE);
        }

        if (activeElement.disabled) {
          return;
        }

        /**
         * If we are selecting a new value,
         * we need to run haptics again.
         */
        if (activeElement !== activeEl) {
          hapticSelectionChanged();
        }

        activeEl = activeElement;
        activeElement.classList.add(PICKER_COL_ACTIVE);

        timeout = setTimeout(() => {
          this.isScrolling = false;
          hapticSelectionEnd();

          /**
           * Certain tasks (such as those that
           * cause re-renders) should only be done
           * once scrolling has finished, otherwise
           * flickering may occur.
           */
          const { scrollEndCallback } = this;
          if (scrollEndCallback) {
            scrollEndCallback();
            this.scrollEndCallback = undefined;
          }

          const dataIndex = activeElement.getAttribute('data-index');

          /**
           * If no value it is
           * possible we hit one of the
           * empty padding columns.
           */
          if (dataIndex === null) {
            return;
          }

          const index = parseInt(dataIndex, 10);
          const selectedItem = this.items[index];

          if (selectedItem.value !== this.value) {
            this.setValue(selectedItem.value);
          }
        }, 250);
      });
    };

    /**
     * Wrap this in an raf so that the scroll callback
     * does not fire when component is initially shown.
     */
    raf(() => {
      el.addEventListener('scroll', scrollCallback);

      this.destroyScrollListener = () => {
        el.removeEventListener('scroll', scrollCallback);
      };
    });
  };

  private focusActiveItem() {
    const activeItem = this.activeItem;
    if (activeItem) {
      /**
       * Focusing the active item on value change
       * will announce the value to screen readers.
       */
      activeItem.focus();
    }
  }

  private onFocus = () => {
    this.focusActiveItem();
  };

  get activeItem() {
    return getElementRoot(this.el).querySelector(
      `.picker-item[data-value="${this.value}"]:not([disabled])`
    ) as HTMLElement | null;
  }

  render() {
    const { items, color, isActive, numericInput } = this;
    const mode = getIonMode(this);

    return (
      <Host
        tabindex={0}
        role="radiogroup"
        class={createColorClasses(color, {
          [mode]: true,
          ['picker-column-active']: isActive,
          ['picker-column-numeric-input']: numericInput,
        })}
        onFocus={this.onFocus}
      >
        <div class="picker-item picker-item-empty" aria-hidden="true">
          &nbsp;
        </div>
        <div class="picker-item picker-item-empty" aria-hidden="true">
          &nbsp;
        </div>
        <div class="picker-item picker-item-empty" aria-hidden="true">
          &nbsp;
        </div>
        {items.map((item, index) => {
          {
            /*
            Users should be able to tab
            between multiple columns. As a result,
            we set tabindex here so that tabbing switches
            between columns instead of buttons. Users
            can still use arrow keys on the keyboard to
            navigate the column up and down.
          */
          }
          return (
            <button
              role="radio"
              tabIndex={-1}
              aria-label={item.ariaLabel}
              aria-checked={item.value === this.value ? 'true' : 'false'}
              class={{
                'picker-item': true,
                'picker-item-disabled': item.disabled || false,
              }}
              data-value={item.value}
              data-index={index}
              onClick={(ev: Event) => {
                this.centerPickerItemInView(ev.target as HTMLElement);
              }}
              disabled={item.disabled}
            >
              {item.text}
            </button>
          );
        })}
        <div class="picker-item picker-item-empty" aria-hidden="true">
          &nbsp;
        </div>
        <div class="picker-item picker-item-empty" aria-hidden="true">
          &nbsp;
        </div>
        <div class="picker-item picker-item-empty" aria-hidden="true">
          &nbsp;
        </div>
      </Host>
    );
  }
}

const PICKER_COL_ACTIVE = 'picker-item-active';
