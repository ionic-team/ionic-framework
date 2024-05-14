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

import type { PickerColumnChangeEventDetail, PickerColumnValue } from './picker-column-interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot prefix - Content to show on the left side of the picker options.
 * @slot suffix - Content to show on the right side of the picker options.
 */
@Component({
  tag: 'ion-picker-column',
  styleUrl: 'picker-column.scss',
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
  private assistiveFocusable?: HTMLElement;
  private updateValueTextOnScroll = false;

  @State() ariaLabel: string | null = null;

  @Watch('aria-label')
  ariaLabelChanged(newValue: string) {
    this.ariaLabel = newValue;
  }

  @State() isActive = false;

  @Element() el!: HTMLIonPickerColumnElement;

  /**
   * If `true`, the user cannot interact with the picker.
   */
  @Prop() disabled = false;

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
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() ionChange!: EventEmitter<PickerColumnChangeEventDetail>;

  @Watch('value')
  valueChange() {
    if (this.isColumnVisible) {
      /**
       * Only scroll the active item into view when the picker column
       * is actively visible to the user.
       */
      this.scrollActiveItemIntoView(true);
    }
  }

  /**
   * Only setup scroll listeners
   * when the picker is visible, otherwise
   * the container will have a scroll
   * height of 0px.
   */
  componentWillLoad() {
    /**
     * We cache parentEl in a local variable
     * so we don't need to keep accessing
     * the class variable (which comes with
     * a small performance hit)
     */
    const parentEl = (this.parentEl = this.el.closest('ion-picker') as HTMLIonPickerElement | null);

    const visibleCallback = (entries: IntersectionObserverEntry[]) => {
      /**
       * Browsers will sometimes group multiple IO events into a single callback.
       * As a result, we want to grab the last/most recent event in case there are multiple events.
       */
      const ev = entries[entries.length - 1];

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
    /**
     * Set the root to be the parent picker element
     * This causes the IO callback
     * to be fired in WebKit as soon as the element
     * is visible. If we used the default root value
     * then WebKit would only fire the IO callback
     * after any animations (such as a modal transition)
     * finished, and there would potentially be a flicker.
     */
    new IntersectionObserver(visibleCallback, { threshold: 0.001, root: this.parentEl }).observe(this.el);

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
  async scrollActiveItemIntoView(smooth = false) {
    const activeEl = this.activeItem;

    if (activeEl) {
      this.centerPickerItemInView(activeEl, smooth, false);
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
    if (this.assistiveFocusable) {
      this.assistiveFocusable.focus();
    }
  }

  connectedCallback() {
    this.ariaLabel = this.el.getAttribute('aria-label') ?? 'Select a value';
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
        this.updateValueTextOnScroll = false;
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
    } else {
      item.classList.remove(PICKER_ITEM_ACTIVE_CLASS);
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

        /**
         * Set the aria-valuetext even though the value prop has not been updated yet.
         * This enables some screen readers to announce the value as the users drag
         * as opposed to when their release their pointer from the screen.
         *
         * When the value is programmatically updated, we will smoothly scroll
         * to the new option. However, we do not want to update aria-valuetext mid-scroll
         * as that can cause the old value to be briefly set before being set to the
         * correct option. This will cause some screen readers to announce the old value
         * again before announcing the new value. The correct valuetext will be set on render.
         */
        if (this.updateValueTextOnScroll) {
          this.assistiveFocusable?.setAttribute('aria-valuetext', this.getOptionValueText(newActiveElement));
        }

        timeout = setTimeout(() => {
          this.isScrolling = false;
          this.updateValueTextOnScroll = true;
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

  /**
   * Find the next enabled option after the active option.
   * @param stride - How many options to "jump" over in order to select the next option.
   * This can be used to implement PageUp/PageDown behaviors where pressing these keys
   * scrolls the picker by more than 1 option. For example, a stride of 5 means select
   * the enabled option 5 options after the active one. Note that the actual option selected
   * may be past the stride if the option at the stride is disabled.
   */
  private findNextOption = (stride = 1) => {
    const { activeItem } = this;
    if (!activeItem) return null;

    let prevNode = activeItem;
    let node = activeItem.nextElementSibling as HTMLIonPickerColumnOptionElement | null;
    while (node != null) {
      if (stride > 0) {
        stride--;
      }

      if (node.tagName === 'ION-PICKER-COLUMN-OPTION' && !node.disabled && stride === 0) {
        return node;
      }
      prevNode = node;

      // Use nextElementSibling instead of nextSibling to avoid text/comment nodes
      node = node.nextElementSibling as HTMLIonPickerColumnOptionElement | null;
    }

    return prevNode;
  };

  /**
   * Find the next enabled option after the active option.
   * @param stride - How many options to "jump" over in order to select the next option.
   * This can be used to implement PageUp/PageDown behaviors where pressing these keys
   * scrolls the picker by more than 1 option. For example, a stride of 5 means select
   * the enabled option 5 options before the active one. Note that the actual option selected
   *  may be past the stride if the option at the stride is disabled.
   */
  private findPreviousOption = (stride: number = 1) => {
    const { activeItem } = this;
    if (!activeItem) return null;

    let nextNode = activeItem;
    let node = activeItem.previousElementSibling as HTMLIonPickerColumnOptionElement | null;
    while (node != null) {
      if (stride > 0) {
        stride--;
      }

      if (node.tagName === 'ION-PICKER-COLUMN-OPTION' && !node.disabled && stride === 0) {
        return node;
      }

      nextNode = node;

      // Use previousElementSibling instead of previousSibling to avoid text/comment nodes
      node = node.previousElementSibling as HTMLIonPickerColumnOptionElement | null;
    }

    return nextNode;
  };

  private onKeyDown = (ev: KeyboardEvent) => {
    /**
     * The below operations should be inverted when running on a mobile device.
     * For example, swiping up will dispatch an "ArrowUp" event. On desktop,
     * this should cause the previous option to be selected. On mobile, swiping
     * up causes a view to scroll down. As a result, swiping up on mobile should
     * cause the next option to be selected. The Home/End operations remain
     * unchanged because those always represent the first/last options, respectively.
     */
    const mobile = isPlatform('mobile');
    let newOption: HTMLIonPickerColumnOptionElement | null = null;
    switch (ev.key) {
      case 'ArrowDown':
        newOption = mobile ? this.findPreviousOption() : this.findNextOption();
        break;
      case 'ArrowUp':
        newOption = mobile ? this.findNextOption() : this.findPreviousOption();
        break;
      case 'PageUp':
        newOption = mobile ? this.findNextOption(5) : this.findPreviousOption(5);
        break;
      case 'PageDown':
        newOption = mobile ? this.findPreviousOption(5) : this.findNextOption(5);
        break;
      case 'Home':
        /**
         * There is no guarantee that the first child will be an ion-picker-column-option,
         * so we do not use firstElementChild.
         */
        newOption = this.el.querySelector<HTMLIonPickerColumnOptionElement>('ion-picker-column-option:first-of-type');
        break;
      case 'End':
        /**
         * There is no guarantee that the last child will be an ion-picker-column-option,
         * so we do not use lastElementChild.
         */
        newOption = this.el.querySelector<HTMLIonPickerColumnOptionElement>('ion-picker-column-option:last-of-type');
        break;
      default:
        break;
    }

    if (newOption !== null) {
      this.setValue(newOption.value);

      // This stops any default browser behavior such as scrolling
      ev.preventDefault();
    }
  };

  /**
   * Utility to generate the correct text for aria-valuetext.
   */
  private getOptionValueText = (el?: HTMLIonPickerColumnOptionElement) => {
    return el ? el.getAttribute('aria-label') ?? el.innerText : '';
  };

  /**
   * Render an element that overlays the column. This element is for assistive
   * tech to allow users to navigate the column up/down. This element should receive
   * focus as it listens for synthesized keyboard events as required by the
   * slider role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role
   */
  private renderAssistiveFocusable = () => {
    const { activeItem } = this;
    const valueText = this.getOptionValueText(activeItem);

    /**
     * When using the picker, the valuetext provides important context that valuenow
     * does not. Additionally, using non-zero valuemin/valuemax values can cause
     * WebKit to incorrectly announce numeric valuetext values (such as a year
     * like "2024") as percentages: https://bugs.webkit.org/show_bug.cgi?id=273126
     */
    return (
      <div
        ref={(el) => (this.assistiveFocusable = el)}
        class="assistive-focusable"
        role="slider"
        tabindex={this.disabled ? undefined : 0}
        aria-label={this.ariaLabel}
        aria-valuemin={0}
        aria-valuemax={0}
        aria-valuenow={0}
        aria-valuetext={valueText}
        aria-orientation="vertical"
        onKeyDown={(ev) => this.onKeyDown(ev)}
      ></div>
    );
  };

  render() {
    const { color, disabled, isActive, numericInput } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          ['picker-column-active']: isActive,
          ['picker-column-numeric-input']: numericInput,
          ['picker-column-disabled']: disabled,
        })}
      >
        {this.renderAssistiveFocusable()}
        <slot name="prefix"></slot>
        <div
          aria-hidden="true"
          class="picker-opts"
          ref={(el) => {
            this.scrollEl = el;
          }}
          /**
           * When an element has an overlay scroll style and
           * a fixed height, Firefox will focus the scrollable
           * container if the content exceeds the container's
           * dimensions.
           *
           * This causes keyboard navigation to focus to this
           * element instead of going to the next element in
           * the tab order.
           *
           * The desired behavior is for the user to be able to
           * focus the assistive focusable element and tab to
           * the next element in the tab order. Instead of tabbing
           * to this element.
           *
           * To prevent this, we set the tabIndex to -1. This
           * will match the behavior of the other browsers.
           */
          tabIndex={-1}
        >
          <div class="picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
          <div class="picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
          <div class="picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
          <slot></slot>
          <div class="picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
          <div class="picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
          <div class="picker-item-empty" aria-hidden="true">
            &nbsp;
          </div>
        </div>
        <slot name="suffix"></slot>
      </Host>
    );
  }
}

const PICKER_ITEM_ACTIVE_CLASS = 'option-active';
