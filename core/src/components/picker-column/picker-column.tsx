import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { doc } from '@utils/browser';
import { getElementRoot, raf } from '@utils/helpers';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from '@utils/native/haptic';
import { isPlatform } from '@utils/platform';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';
import type { PickerCustomEvent } from '../picker/picker-interfaces';

import type { PickerColumnItem, PickerColumnChangeEventDetail, PickerColumnValue } from './picker-column-interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot prefix - Content to show on the left side of the picker options.
 * @slot suffix - Content to show on the right side of the picker options.
 */
// TODO FW-5580 we can likely go back to a single stylesheet here
// the per-mode styles were moved to ion-picker-column-option
@Component({
  tag: 'ion-picker-column',
  styleUrls: {
    ios: 'picker-column.ios.scss',
    md: 'picker-column.md.scss',
  },
  shadow: true,
})
export class PickerColumn implements ComponentInterface {
  private scrollEl?: HTMLDivElement | null;
  private destroyScrollListener?: () => void;
  private isScrolling = false;
  private scrollEndCallback?: () => void;
  private isColumnVisible = false;
  private parentEl?: HTMLIonPickerElement | null;
  private canExitInputMode = true;

  @State() isActive = false;

  @Element() el!: HTMLIonPickerColumnElement;

  /**
   * If `true`, the user cannot interact with the picker.
   */
  @Prop() disabled = false;

  /**
   * A list of options to be displayed in the picker
   */
  @Prop() items: PickerColumnItem[] = [];

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
  @Event() ionChange!: EventEmitter<PickerColumnChangeEventDetail>;

  @Watch('value')
  valueChange() {
    if (this.isColumnVisible) {
      /**
       * Only scroll the active item into view when the picker column
       * is actively visible to the user.
       */
      this.scrollActiveItemIntoView();
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
        const { activeItem, el } = this;

        this.isColumnVisible = true;
        /**
         * Because this initial call to scrollActiveItemIntoView has to fire before
         * the scroll listener is set up, we need to manage the active class manually.
         */
        const oldActive = getElementRoot(el).querySelector<HTMLIonPickerColumnOptionElement>(
          `.${PICKER_ITEM_ACTIVE_CLASS}`
        );
        if (oldActive) {
          this.setPickerItemActiveState(oldActive, false);
        }
        this.scrollActiveItemIntoView();
        if (activeItem) {
          this.setPickerItemActiveState(activeItem, true);
        }

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

    const parentEl = (this.parentEl = this.el.closest('ion-picker') as HTMLIonPickerElement | null);
    if (parentEl !== null) {
      // TODO(FW-2832): type
      parentEl.addEventListener('ionInputModeChange', (ev: any) => this.inputModeChange(ev));
    }
  }

  componentDidRender() {
    const { el, activeItem, isColumnVisible, value } = this;

    if (isColumnVisible && !activeItem) {
      const firstOption = el.querySelector('ion-picker-column-option');

      /**
       * If the picker column does not have an active item and the current value
       * does not match the first item in the picker column, that means
       * the value is out of bounds. In this case, we assign the value to the
       * first item to match the scroll position of the column.
       *
       */
      if (firstOption !== null && firstOption.value !== value) {
        this.setValue(firstOption.value);
      }
    }
  }

  /** @internal  */
  @Method()
  async scrollActiveItemIntoView() {
    const activeEl = this.activeItem;

    if (activeEl) {
      this.centerPickerItemInView(activeEl, false, false);
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
  async setValue(value: PickerColumnValue) {
    if (this.disabled === true || this.value === value) {
      return;
    }

    this.value = value;
    this.ionChange.emit({ value });
  }

  /**
   * Sets focus on the scrollable container within the picker column.
   * Use this method instead of the global `pickerColumn.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.scrollEl) {
      this.scrollEl.focus();
    }
  }

  private centerPickerItemInView = (target: HTMLElement, smooth = true, canExitInputMode = true) => {
    const { isColumnVisible, scrollEl } = this;

    if (isColumnVisible && scrollEl) {
      // (Vertical offset from parent) - (three empty picker rows) + (half the height of the target to ensure the scroll triggers)
      const top = target.offsetTop - 3 * target.clientHeight + target.clientHeight / 2;

      if (scrollEl.scrollTop !== top) {
        /**
         * Setting this flag prevents input
         * mode from exiting in the picker column's
         * scroll callback. This is useful when the user manually
         * taps an item or types on the keyboard as both
         * of these can cause a scroll to occur.
         */
        this.canExitInputMode = canExitInputMode;
        scrollEl.scroll({
          top,
          left: 0,
          behavior: smooth ? 'smooth' : undefined,
        });
      }
    }
  };

  private setPickerItemActiveState = (item: HTMLIonPickerColumnOptionElement, isActive: boolean) => {
    if (isActive) {
      item.classList.add(PICKER_ITEM_ACTIVE_CLASS);
      item.part.add(PICKER_ITEM_ACTIVE_PART);
    } else {
      item.classList.remove(PICKER_ITEM_ACTIVE_CLASS);
      item.part.remove(PICKER_ITEM_ACTIVE_PART);
    }
  };

  /**
   * When ionInputModeChange is emitted, each column
   * needs to check if it is the one being made available
   * for text entry.
   */
  private inputModeChange = (ev: PickerCustomEvent) => {
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
    /**
     * The haptics for the wheel picker are
     * an iOS-only feature. As a result, they should
     * be disabled on Android.
     */
    const enableHaptics = isPlatform('ios');
    const { el, scrollEl } = this;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    let activeEl: HTMLIonPickerColumnOptionElement | undefined = this.activeItem;

    const scrollCallback = () => {
      raf(() => {
        if (!scrollEl) return;

        if (timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }

        if (!this.isScrolling) {
          enableHaptics && hapticSelectionStart();
          this.isScrolling = true;
        }

        /**
         * Select item in the center of the column
         * which is the month/year that we want to select
         */
        const bbox = scrollEl.getBoundingClientRect();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;

        /**
         * elementFromPoint returns the top-most element.
         * This means that if an ion-backdrop is overlaying the
         * picker then the appropriate picker column option will
         * not be selected. To account for this, we use elementsFromPoint
         * and use an Array.find to find the appropriate column option
         * at that point.
         *
         * Additionally, the picker column could be used in the
         * Shadow DOM (i.e. in ion-datetime) so we need to make
         * sure we are choosing the correct host otherwise
         * the elements returns by elementsFromPoint will be
         * retargeted. To account for this, we check to see
         * if the picker column has a parent shadow root. If
         * so, we use that shadow root when doing elementsFromPoint.
         * Otherwise, we just use the document.
         */
        const rootNode = el.getRootNode();
        const hasParentShadow = rootNode instanceof ShadowRoot;
        const referenceNode = hasParentShadow ? (rootNode as ShadowRoot) : doc;

        /**
         * If the reference node is undefined
         * then it's likely that doc is undefined
         * due to being in an SSR environment.
         */
        if (referenceNode === undefined) {
          return;
        }

        const elementsAtPoint = referenceNode.elementsFromPoint(centerX, centerY) as HTMLIonPickerColumnOptionElement[];

        /**
         * elementsFromPoint can returns multiple elements
         * so find the relevant picker column option if one exists.
         */
        const newActiveElement = elementsAtPoint.find((el) => el.tagName === 'ION-PICKER-COLUMN-OPTION');

        if (activeEl !== undefined) {
          this.setPickerItemActiveState(activeEl, false);
        }

        if (newActiveElement === undefined || newActiveElement.disabled) {
          return;
        }

        /**
         * If we are selecting a new value,
         * we need to run haptics again.
         */
        if (newActiveElement !== activeEl) {
          enableHaptics && hapticSelectionChanged();

          if (this.canExitInputMode) {
            /**
             * The native iOS wheel picker
             * only dismisses the keyboard
             * once the selected item has changed
             * as a result of a swipe
             * from the user. If `canExitInputMode` is
             * `false` then this means that the
             * scroll is happening as a result of
             * the `value` property programmatically changing
             * either by an application or by the user via the keyboard.
             */
            this.exitInputMode();
          }
        }

        activeEl = newActiveElement;
        this.setPickerItemActiveState(newActiveElement, true);

        timeout = setTimeout(() => {
          this.isScrolling = false;
          enableHaptics && hapticSelectionEnd();

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

          /**
           * Reset this flag as the
           * next scroll interaction could
           * be a scroll from the user. In this
           * case, we should exit input mode.
           */
          this.canExitInputMode = true;

          this.setValue(newActiveElement.value);
        }, 250);
      });
    };

    /**
     * Wrap this in an raf so that the scroll callback
     * does not fire when component is initially shown.
     */
    raf(() => {
      if (!scrollEl) return;

      scrollEl.addEventListener('scroll', scrollCallback);

      this.destroyScrollListener = () => {
        scrollEl.removeEventListener('scroll', scrollCallback);
      };
    });
  };

  /**
   * Tells the parent picker to
   * exit text entry mode. This is only called
   * when the selected item changes during scroll, so
   * we know that the user likely wants to scroll
   * instead of type.
   */
  private exitInputMode = () => {
    const { parentEl } = this;

    if (parentEl == null) return;

    parentEl.exitInputMode();

    /**
     * setInputModeActive only takes
     * effect once scrolling stops to avoid
     * a component re-render while scrolling.
     * However, we want the visual active
     * indicator to go away immediately, so
     * we call classList.remove here.
     */
    this.el.classList.remove('picker-column-active');
  };

  get activeItem() {
    const { value } = this;
    const options = Array.from(this.el.querySelectorAll<HTMLIonPickerColumnOptionElement>('ion-picker-column-option'));
    return options.find((option) => {
      /**
       * If the whole picker column is disabled, the current value should appear active
       * If the current value item is specifically disabled, it should not appear active
       */
      if (!this.disabled && option.disabled) {
        return false;
      }

      return option.value === value;
    });
  }

  render() {
    const { color, disabled, isActive, numericInput } = this;
    const mode = getIonMode(this);

    /**
     * exportparts is needed so ion-datetime can expose the parts
     * from two layers of shadow nesting. If this causes problems,
     * the attribute can be moved to datetime.tsx and set on every
     * instance of ion-picker-column there instead.
     * TODO FW-5580 remove exportparts
     */

    return (
      <Host
        exportparts={`${PICKER_ITEM_PART}, ${PICKER_ITEM_ACTIVE_PART}`}
        class={createColorClasses(color, {
          [mode]: true,
          ['picker-column-active']: isActive,
          ['picker-column-numeric-input']: numericInput,
          ['picker-column-disabled']: disabled,
        })}
      >
        <slot name="prefix"></slot>
        <div
          class="picker-opts"
          tabindex={disabled ? undefined : 0}
          ref={(el) => {
            this.scrollEl = el;
          }}
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
          <slot></slot>
          <div class="picker-item picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
          <div class="picker-item picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
          <div class="picker-item picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
        </div>
        <slot name="suffix"></slot>
      </Host>
    );
  }
}

const PICKER_ITEM_ACTIVE_CLASS = 'option-active';
const PICKER_ITEM_PART = 'wheel-item';
const PICKER_ITEM_ACTIVE_PART = 'active';
