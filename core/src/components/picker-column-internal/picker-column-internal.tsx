import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { getElementRoot, raf } from '../../utils/helpers';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from '../../utils/native/haptic';
import { createColorClasses } from '../../utils/theme';
import { PickerInternalCustomEvent } from '../picker-internal/picker-internal-interfaces';

import { PickerColumnItem } from './picker-column-internal-interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 * @internal
 */
@Component({
  tag: 'ion-picker-column-internal',
  styleUrls: {
    ios: 'picker-column-internal.ios.scss',
    md: 'picker-column-internal.md.scss'
  },
  shadow: true
})
export class PickerColumnInternal implements ComponentInterface {
  private destroyScrollListener?: () => void;
  private hapticsStarted = false;
  private isColumnVisible = false;

  @State() isActive = false;

  @Element() el!: HTMLIonPickerColumnInternalElement;

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
  @Event() ionChange!: EventEmitter<PickerColumnItem>;

  @Watch('value')
  valueChange() {
    if (this.isColumnVisible) {
      /**
       * Only scroll the active item into view and emit the value
       * change, when the picker column is actively visible to the user.
       */
      const { items, value } = this;
      this.scrollActiveItemIntoView();

      const findItem = items.find(item => item.value === value);
      if (findItem) {
        this.ionChange.emit(findItem);
      }
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
        /**
         * Because this initial call to scrollActiveItemIntoView has to fire before
         * the scroll listener is set up, we need to manage the active class manually.
         */
        const oldActive = getElementRoot(this.el).querySelector(`.${PICKER_COL_ACTIVE}`);
        oldActive?.classList.remove(PICKER_COL_ACTIVE);
        this.scrollActiveItemIntoView();
        this.activeItem?.classList.add(PICKER_COL_ACTIVE);

        this.initializeScrollListener();
        this.isColumnVisible = true;
      } else {
        if (this.destroyScrollListener) {
          this.destroyScrollListener();
          this.destroyScrollListener = undefined;
        }
        this.isColumnVisible = false;
      }
    }
    new IntersectionObserver(visibleCallback, { threshold: 0.01 }).observe(this.el);

    const parentEl = this.el.closest('ion-picker-internal') as HTMLIonPickerInternalElement | null;
    if (parentEl !== null) {
      parentEl.addEventListener('ionInputModeChange', (ev: any) => this.inputModeChange(ev));
    }
  }

  scrollActiveItemIntoView() {
    const activeEl = this.activeItem;

    if (activeEl) {
      this.centerPickerItemInView(activeEl, false);
    }
  }

  private centerPickerItemInView = (target: HTMLElement, smooth = true) => {
    this.el.scroll({
      // (Vertical offset from parent) - (three empty picker rows) + (half the height of the target to ensure the scroll triggers)
      top: target.offsetTop - (3 * target.clientHeight) + (target.clientHeight / 2),
      left: 0,
      behavior: smooth ? 'smooth' : undefined
    });
  }

  /**
   * When ionInputModeChange is emitted, each column
   * needs to check if it is the one being made available
   * for text entry.
   */
  private inputModeChange = (ev: PickerInternalCustomEvent) => {
    if (!this.numericInput) { return; }

    const { useInputMode, inputModeColumn } = ev.detail;

    /**
     * If inputModeColumn is undefined then this means
     * all numericInput columns are being selected.
     */
    const isColumnActive = inputModeColumn === undefined || inputModeColumn === this.el;

    if (!useInputMode || !isColumnActive) {
      this.isActive = false;
      return;
    }

    this.isActive = true;
  }

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

        if (!this.hapticsStarted) {
          hapticSelectionStart();
          this.hapticsStarted = true;
        }

        /**
         * Select item in the center of the column
         * which is the month/year that we want to select
         */
        const bbox = el.getBoundingClientRect();
        const centerX = bbox.x + (bbox.width / 2);
        const centerY = bbox.y + (bbox.height / 2);

        const activeElement = el.shadowRoot!.elementFromPoint(centerX, centerY) as HTMLElement;
        if (activeEl !== null) {
          activeEl.classList.remove(PICKER_COL_ACTIVE);
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
          const dataIndex = activeElement.getAttribute('data-index');

          /**
           * If no value it is
           * possible we hit one of the
           * empty padding columns.
           */
          if (dataIndex === null) { return; }

          const index = parseInt(dataIndex, 10);
          const selectedItem = this.items[index];

          if (selectedItem.value !== this.value) {
            this.value = selectedItem.value;
            hapticSelectionEnd();
            this.hapticsStarted = false;
          }
        }, 250);
      })
    };

    /**
     * Wrap this in an raf so that the scroll callback
     * does not fire when component is initially shown.
     */
    raf(() => {
      el.addEventListener('scroll', scrollCallback);

      this.destroyScrollListener = () => {
        el.removeEventListener('scroll', scrollCallback);
      }
    });
  }

  get activeItem() {
    return getElementRoot(this.el).querySelector(`.picker-item[data-value="${this.value}"]`) as HTMLElement | null;
  }

  render() {
    const { items, color, isActive, numericInput } = this;
    const mode = getIonMode(this);

    return (
      <Host
        tabindex={0}
        class={createColorClasses(color, {
          [mode]: true,
          ['picker-column-active']: isActive,
          ['picker-column-numeric-input']: numericInput
        })}
      >
        <div class="picker-item picker-item-empty">&nbsp;</div>
        <div class="picker-item picker-item-empty">&nbsp;</div>
        <div class="picker-item picker-item-empty">&nbsp;</div>
        {items.map((item, index) => {
          return (
            <div
              class="picker-item"
              data-value={item.value}
              data-index={index}
              onClick={(ev: Event) => {
                this.centerPickerItemInView(ev.target as HTMLElement);
              }}
            >{item.text}</div>
          )
        })}
        <div class="picker-item picker-item-empty">&nbsp;</div>
        <div class="picker-item picker-item-empty">&nbsp;</div>
        <div class="picker-item picker-item-empty">&nbsp;</div>
      </Host>
    );
  }
}

const PICKER_COL_ACTIVE = 'picker-item-active';
