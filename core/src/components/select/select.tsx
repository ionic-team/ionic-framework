import caretDownRegular from '@phosphor-icons/core/assets/regular/caret-down.svg';
import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h, forceUpdate } from '@stencil/core';
import type { NotchController } from '@utils/forms';
import { compareOptions, createNotchController, isOptionSelected } from '@utils/forms';
import { focusVisibleElement, renderHiddenInput, inheritAttributes } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';
import { actionSheetController, alertController, popoverController, modalController } from '@utils/overlays';
import type { OverlaySelect } from '@utils/overlays-interface';
import { isRTL } from '@utils/rtl';
import { createColorClasses, hostContext } from '@utils/theme';
import { watchForOptions } from '@utils/watch-options';
import { caretDownSharp, chevronExpand } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type {
  ActionSheetOptions,
  AlertOptions,
  Color,
  CssClassMap,
  PopoverOptions,
  StyleEventDetail,
  ModalOptions,
} from '../../interface';
import type { ActionSheetButton } from '../action-sheet/action-sheet-interface';
import type { AlertInput } from '../alert/alert-interface';
import type { SelectPopoverOption } from '../select-popover/select-popover-interface';

import type { SelectChangeEventDetail, SelectInterface, SelectCompareFn } from './select-interface';

// TODO(FW-2832): types

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot label - The label text to associate with the select. Use the `labelPlacement` property to control where the label is placed relative to the select. Use this if you need to render a label with custom HTML.
 * @slot start - Content to display at the leading edge of the select.
 * @slot end - Content to display at the trailing edge of the select.
 *
 * @part placeholder - The text displayed in the select when there is no value.
 * @part text - The displayed value of the select.
 * @part icon - The select icon container.
 * @part container - The container for the selected text or placeholder.
 * @part label - The label text describing the select.
 */
@Component({
  tag: 'ion-select',
  styleUrls: {
    ios: 'select.ios.scss',
    md: 'select.md.scss',
    ionic: 'select.ionic.scss',
  },
  shadow: true,
})
export class Select implements ComponentInterface {
  private inputId = `ion-sel-${selectIds++}`;
  private overlay?: OverlaySelect;
  private focusEl?: HTMLButtonElement;
  private mutationO?: MutationObserver;
  private inheritedAttributes: Attributes = {};
  private nativeWrapperEl: HTMLElement | undefined;
  private notchSpacerEl: HTMLElement | undefined;

  private notchController?: NotchController;

  @Element() el!: HTMLIonSelectElement;

  @State() isExpanded = false;

  /**
   * The text to display on the cancel button.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   *
   * This property is only available when using the modern select syntax.
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * This property allows developers to specify a custom function or property
   * name for comparing objects when determining the selected option in the
   * ion-select. When not specified, the default behavior will use strict
   * equality (===) for comparison.
   */
  @Prop() compareWith?: string | SelectCompareFn | null;

  /**
   * If `true`, the user cannot interact with the select.
   */
  @Prop() disabled = false;

  /**
   * The fill for the item. If `"solid"` the item will have a background. If
   * `"outline"` the item will be transparent with a border. Only available in the `"md"` theme.
   */
  @Prop() fill?: 'outline' | 'solid';

  /**
   * The interface the select should use: `action-sheet`, `popover`, `alert`, or `modal`.
   */
  @Prop() interface: SelectInterface = 'alert';

  /**
   * Any additional options that the `alert`, `action-sheet` or `popover` interface
   * can take. See the [ion-alert docs](./alert), the
   * [ion-action-sheet docs](./action-sheet), the
   * [ion-popover docs](./popover), and the [ion-modal docs](./modal) for the
   * create options for each interface.
   *
   * Note: `interfaceOptions` will not override `inputs` or `buttons` with the `alert` interface.
   */
  @Prop() interfaceOptions: any = {};

  /**
   * How to pack the label and select within a line.
   * `justify` does not apply when the label and select
   * are on different lines when `labelPlacement` is set to
   * `"floating"` or `"stacked"`.
   * `"start"`: The label and select will appear on the left in LTR and
   * on the right in RTL.
   * `"end"`: The label and select will appear on the right in LTR and
   * on the left in RTL.
   * `"space-between"`: The label and select will appear on opposite
   * ends of the line with space between the two elements.
   */
  @Prop() justify?: 'start' | 'end' | 'space-between';

  /**
   * The visible label associated with the select.
   *
   * Use this if you need to render a plaintext label.
   *
   * The `label` property will take priority over the `label` slot if both are used.
   */
  @Prop() label?: string;

  /**
   * Where to place the label relative to the select.
   * `"start"`: The label will appear to the left of the select in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the select in LTR and to the left in RTL.
   * `"floating"`: The label will appear smaller and above the select when the select is focused or it has a value. Otherwise it will appear on top of the select.
   * `"stacked"`: The label will appear smaller and above the select regardless even when the select is blurred or has no value.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   * When using `"floating"` or `"stacked"` we recommend initializing the select with either a `value` or a `placeholder`.
   */
  @Prop() labelPlacement?: 'start' | 'end' | 'floating' | 'stacked' | 'fixed' = 'start';

  /**
   * If `true`, the select can accept multiple values.
   */
  @Prop() multiple = false;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * The text to display on the ok button.
   */
  @Prop() okText = 'OK';

  /**
   * The text to display when the select is empty.
   */
  @Prop() placeholder?: string;

  /**
   * The text to display instead of the selected option's value.
   */
  @Prop() selectedText?: string | null;

  /**
   * The toggle icon to use. Defaults to `"chevronExpand"` for the `"ios"` theme,
   * or `"caretDownSharp"` for the `"md"` and `"ionic"` themes.
   */
  @Prop() toggleIcon?: string;

  /**
   * The toggle icon to show when the select is open. If defined, the icon
   * rotation behavior in `"md"` theme will be disabled. If undefined, `toggleIcon`
   * will be used for when the select is both open and closed.
   */
  @Prop() expandedIcon?: string;

  /**
   * Set to `"soft"` for a select with slightly rounded corners,
   * `"round"` for a select with fully rounded corners,
   * or `"rectangular"` for a select without rounded corners.
   *
   * Defaults to `"round"` for the `"ionic"` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  /**
   * The value of the select.
   */
  @Prop({ mutable: true }) value?: any | null;

  /**
   * The size of the select. If "large" it will increase the height of the select, while
   * "small" and "medium" provide progressively smaller heights.
   *
   * Defaults to `"medium"` for the ionic theme, and  undefined for all other themes.
   */
  @Prop() size?: 'small' | 'medium' | 'large';

  /**
   * Emitted when the value has changed.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() ionChange!: EventEmitter<SelectChangeEventDetail>;

  /**
   * Emitted when the selection is cancelled.
   */
  @Event() ionCancel!: EventEmitter<void>;

  /**
   * Emitted when the overlay is dismissed.
   */
  @Event() ionDismiss!: EventEmitter<void>;

  /**
   * Emitted when the select has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the select loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('disabled')
  @Watch('isExpanded')
  @Watch('placeholder')
  @Watch('value')
  protected styleChanged() {
    this.emitStyle();
  }

  private setValue(value?: any | null) {
    this.value = value;
    this.ionChange.emit({ value });
  }

  async connectedCallback() {
    const { el } = this;

    this.notchController = createNotchController(
      el,
      () => this.notchSpacerEl,
      () => this.labelSlot
    );

    this.updateOverlayOptions();
    this.emitStyle();

    this.mutationO = watchForOptions<HTMLIonSelectOptionElement>(this.el, 'ion-select-option', async () => {
      this.updateOverlayOptions();

      /**
       * We need to re-render the component
       * because one of the new ion-select-option
       * elements may match the value. In this case,
       * the rendered selected text should be updated.
       */
      forceUpdate(this);
    });
  }

  componentWillLoad() {
    this.inheritedAttributes = inheritAttributes(this.el, ['aria-label']);
  }

  componentDidLoad() {
    /**
     * If any of the conditions that trigger the styleChanged callback
     * are met on component load, it is possible the event emitted
     * prior to a parent web component registering an event listener.
     *
     * To ensure the parent web component receives the event, we
     * emit the style event again after the component has loaded.
     *
     * This is often seen in Angular with the `dist` output target.
     */
    this.emitStyle();
  }

  disconnectedCallback() {
    if (this.mutationO) {
      this.mutationO.disconnect();
      this.mutationO = undefined;
    }

    if (this.notchController) {
      this.notchController.destroy();
      this.notchController = undefined;
    }
  }

  /**
   * Open the select overlay. The overlay is either an alert, action sheet, or popover,
   * depending on the `interface` property on the `ion-select`.
   *
   * @param event The user interface event that called the open.
   */
  @Method()
  async open(event?: UIEvent): Promise<any> {
    if (this.disabled || this.isExpanded) {
      return undefined;
    }
    this.isExpanded = true;
    const overlay = (this.overlay = await this.createOverlay(event));
    overlay.onDidDismiss().then(() => {
      this.overlay = undefined;
      this.isExpanded = false;
      this.ionDismiss.emit();
      this.setFocus();
    });

    await overlay.present();

    const indexOfSelected = this.childOpts.findIndex((o) => o.value === this.value);
    if (indexOfSelected > -1) {
      const selectedItem = overlay.querySelector<HTMLElement>(
        `.select-interface-option:nth-child(${indexOfSelected + 1})`
      );

      if (selectedItem) {
        /**
         * Browsers such as Firefox do not
         * correctly delegate focus when manually
         * focusing an element with delegatesFocus.
         * We work around this by manually focusing
         * the interactive element.
         * ion-radio and ion-checkbox are the only
         * elements that ion-select-popover uses, so
         * we only need to worry about those two components
         * when focusing.
         */
        const interactiveEl = selectedItem.querySelector<HTMLElement>('ion-radio, ion-checkbox') as
          | HTMLIonRadioElement
          | HTMLIonCheckboxElement
          | null;
        if (interactiveEl) {
          // Needs to be called before `focusVisibleElement` to prevent issue with focus event bubbling
          // and removing `ion-focused` style
          interactiveEl.setFocus();
        }

        focusVisibleElement(selectedItem);
      }
    } else {
      /**
       * If no value is set then focus the first enabled option.
       */
      const firstEnabledOption = overlay.querySelector<HTMLElement>(
        'ion-radio:not(.radio-disabled), ion-checkbox:not(.checkbox-disabled)'
      ) as HTMLIonRadioElement | HTMLIonCheckboxElement | null;

      if (firstEnabledOption) {
        /**
         * Focus the option for the same reason as we do above.
         *
         * Needs to be called before `focusVisibleElement` to prevent issue with focus event bubbling
         * and removing `ion-focused` style
         */
        firstEnabledOption.setFocus();

        focusVisibleElement(firstEnabledOption.closest('ion-item')!);
      }
    }    
    
    return overlay;
  }

  private createOverlay(ev?: UIEvent): Promise<OverlaySelect> {
    let selectInterface = this.interface;
    if (selectInterface === 'action-sheet' && this.multiple) {
      console.warn(
        `Select interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`
      );
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover' && !ev) {
      console.warn(
        `Select interface cannot be a "${selectInterface}" without passing an event. Using the "alert" interface instead.`
      );
      selectInterface = 'alert';
    }

    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }
    if (selectInterface === 'popover') {
      return this.openPopover(ev!);
    }
    if (selectInterface === 'modal') {
      return this.openModal();
    }
    return this.openAlert();
  }

  private updateOverlayOptions(): void {
    const overlay = this.overlay as any;
    if (!overlay) {
      return;
    }
    const childOpts = this.childOpts;
    const value = this.value;
    switch (this.interface) {
      case 'action-sheet':
        overlay.buttons = this.createActionSheetButtons(childOpts, value);
        break;
      case 'popover':
        const popover = overlay.querySelector('ion-select-popover');
        if (popover) {
          popover.options = this.createOverlaySelectOptions(childOpts, value);
        }
        break;
      case 'modal':
        const modal = overlay.querySelector('ion-select-modal');
        if (modal) {
          modal.options = this.createOverlaySelectOptions(childOpts, value);
        }
        break;
      case 'alert':
        const inputType = this.multiple ? 'checkbox' : 'radio';
        overlay.inputs = this.createAlertInputs(childOpts, inputType, value);
        break;
    }
  }

  private createActionSheetButtons(data: HTMLIonSelectOptionElement[], selectValue: any): ActionSheetButton[] {
    const actionSheetButtons = data.map((option) => {
      const value = getOptionValue(option);

      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList)
        .filter((cls) => cls !== 'hydrated')
        .join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;

      return {
        role: isOptionSelected(selectValue, value, this.compareWith) ? 'selected' : '',
        text: option.textContent,
        cssClass: optClass,
        handler: () => {
          this.setValue(value);
        },
      } as ActionSheetButton;
    });

    // Add "cancel" button
    actionSheetButtons.push({
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit();
      },
    });

    return actionSheetButtons;
  }

  private createAlertInputs(
    data: HTMLIonSelectOptionElement[],
    inputType: 'checkbox' | 'radio',
    selectValue: any
  ): AlertInput[] {
    const alertInputs = data.map((option) => {
      const value = getOptionValue(option);

      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList)
        .filter((cls) => cls !== 'hydrated')
        .join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;

      return {
        type: inputType,
        cssClass: optClass,
        label: option.textContent || '',
        value,
        checked: isOptionSelected(selectValue, value, this.compareWith),
        disabled: option.disabled,
      };
    });

    return alertInputs;
  }

  private createOverlaySelectOptions(data: HTMLIonSelectOptionElement[], selectValue: any): SelectPopoverOption[] {
    const popoverOptions = data.map((option) => {
      const value = getOptionValue(option);

      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList)
        .filter((cls) => cls !== 'hydrated')
        .join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;

      return {
        text: option.textContent || '',
        cssClass: optClass,
        value,
        checked: isOptionSelected(selectValue, value, this.compareWith),
        disabled: option.disabled,
        handler: (selected: any) => {
          this.setValue(selected);
          if (!this.multiple) {
            this.close();
          }
        },
      };
    });

    return popoverOptions;
  }

  private async openPopover(ev: UIEvent) {
    const { fill, labelPlacement } = this;
    const interfaceOptions = this.interfaceOptions;
    const theme = getIonTheme(this);
    const showBackdrop = theme === 'md' ? false : true;
    const multiple = this.multiple;
    const value = this.value;

    let event: Event | CustomEvent = ev;
    let size = 'auto';

    const hasFloatingOrStackedLabel = labelPlacement === 'floating' || labelPlacement === 'stacked';
    /**
     * The popover should take up the full width
     * when using a fill in MD mode or if the
     * label is floating/stacked.
     */
    if (hasFloatingOrStackedLabel || (theme === 'md' && fill !== undefined)) {
      size = 'cover';

      /**
       * Otherwise the popover
       * should be positioned relative
       * to the native element.
       */
    } else {
      event = {
        ...ev,
        detail: {
          ionShadowTarget: this.nativeWrapperEl,
        },
      };
    }

    const popoverOpts: PopoverOptions = {
      theme,
      event,
      alignment: 'center',
      size,
      showBackdrop,
      ...interfaceOptions,

      component: 'ion-select-popover',
      cssClass: ['select-popover', interfaceOptions.cssClass],
      componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        multiple,
        value,
        options: this.createOverlaySelectOptions(this.childOpts, value),
      },
    };

    /**
     * Workaround for Stencil to autodefine
     * ion-select-popover and ion-popover when
     * using Custom Elements build.
     */
    // eslint-disable-next-line
    if (false) {
      // eslint-disable-next-line
      // @ts-ignore
      document.createElement('ion-select-popover');
      document.createElement('ion-popover');
    }

    return popoverController.create(popoverOpts);
  }

  private async openActionSheet() {
    const theme = getIonTheme(this);
    const interfaceOptions = this.interfaceOptions;
    const actionSheetOpts: ActionSheetOptions = {
      theme,
      ...interfaceOptions,

      buttons: this.createActionSheetButtons(this.childOpts, this.value),
      cssClass: ['select-action-sheet', interfaceOptions.cssClass],
    };

    /**
     * Workaround for Stencil to autodefine
     * ion-action-sheet when
     * using Custom Elements build.
     */
    // eslint-disable-next-line
    if (false) {
      // eslint-disable-next-line
      // @ts-ignore
      document.createElement('ion-action-sheet');
    }

    return actionSheetController.create(actionSheetOpts);
  }

  private async openAlert() {
    const interfaceOptions = this.interfaceOptions;
    const inputType = this.multiple ? 'checkbox' : 'radio';
    const theme = getIonTheme(this);

    const alertOpts: AlertOptions = {
      theme,
      ...interfaceOptions,

      header: interfaceOptions.header ? interfaceOptions.header : this.labelText,
      inputs: this.createAlertInputs(this.childOpts, inputType, this.value),
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit();
          },
        },
        {
          text: this.okText,
          handler: (selectedValues: any) => {
            this.setValue(selectedValues);
          },
        },
      ],
      cssClass: [
        'select-alert',
        interfaceOptions.cssClass,
        this.multiple ? 'multiple-select-alert' : 'single-select-alert',
      ],
    };

    /**
     * Workaround for Stencil to autodefine
     * ion-alert when
     * using Custom Elements build.
     */
    // eslint-disable-next-line
    if (false) {
      // eslint-disable-next-line
      // @ts-ignore
      document.createElement('ion-alert');
    }

    return alertController.create(alertOpts);
  }

  private openModal() {
    const { multiple, value, interfaceOptions } = this;
    const theme = getIonTheme(this);

    const modalOpts: ModalOptions = {
      ...interfaceOptions,
      mode: theme,

      cssClass: ['select-modal', interfaceOptions.cssClass],
      component: 'ion-select-modal',
      componentProps: {
        header: interfaceOptions.header,
        multiple,
        value,
        options: this.createOverlaySelectOptions(this.childOpts, value),
      },
    };

    /**
     * Workaround for Stencil to autodefine
     * ion-select-modal and ion-modal when
     * using Custom Elements build.
     */
    // eslint-disable-next-line
    if (false) {
      // eslint-disable-next-line
      // @ts-ignore
      document.createElement('ion-select-modal');
      document.createElement('ion-modal');
    }

    return modalController.create(modalOpts);
  }

  /**
   * Close the select interface.
   */
  private close(): Promise<boolean> {
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }

  private hasValue(): boolean {
    return this.getText() !== '';
  }

  private get childOpts() {
    return Array.from(this.el.querySelectorAll('ion-select-option'));
  }

  /**
   * Returns any plaintext associated with
   * the label (either prop or slot).
   * Note: This will not return any custom
   * HTML. Use the `hasLabel` getter if you
   * want to know if any slotted label content
   * was passed.
   */
  private get labelText() {
    const { label } = this;

    if (label !== undefined) {
      return label;
    }

    const { labelSlot } = this;

    if (labelSlot !== null) {
      return labelSlot.textContent;
    }

    return;
  }

  private getText(): string {
    const selectedText = this.selectedText;
    if (selectedText != null && selectedText !== '') {
      return selectedText;
    }
    return generateText(this.childOpts, this.value, this.compareWith);
  }

  private setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }

  private emitStyle() {
    const { disabled } = this;

    const style: StyleEventDetail = {
      'interactive-disabled': disabled,
    };

    this.ionStyle.emit(style);
  }

  private onClick = (ev: UIEvent) => {
    const target = ev.target as HTMLElement;
    const closestSlot = target.closest('[slot="start"], [slot="end"]');

    if (target === this.el || closestSlot === null) {
      this.setFocus();
      this.open(ev);
    } else {
      /**
       * Prevent clicks to the start/end slots from opening the select.
       * We ensure the target isn't this element in case the select is slotted
       * in, for example, an item. This would prevent the select from ever
       * being opened since the element itself has slot="start"/"end".
       *
       * Clicking a slotted element also causes a click
       * on the <label> element (since it wraps the slots).
       * Clicking <label> dispatches another click event on
       * the native form control that then bubbles up to this
       * listener. This additional event targets the host
       * element, so the select overlay is opened.
       *
       * When the slotted elements are clicked (and therefore
       * the ancestor <label> element) we want to prevent the label
       * from dispatching another click event.
       *
       * Do not call stopPropagation() because this will cause
       * click handlers on the slotted elements to never fire in React.
       * When developers do onClick in React a native "click" listener
       * is added on the root element, not the slotted element. When that
       * native click listener fires, React then dispatches the synthetic
       * click event on the slotted element. However, if stopPropagation
       * is called then the native click event will never bubble up
       * to the root element.
       */
      ev.preventDefault();
    }
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private getSize(): string | undefined {
    const theme = getIonTheme(this);
    const { size } = this;

    // TODO(ROU-11370): Remove theme check when sizes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (size === undefined) {
      return 'medium';
    }

    return size;
  }

  private renderLabel() {
    const { label } = this;

    return (
      <div
        class={{
          'label-text-wrapper': true,
          'label-text-wrapper-hidden': !this.hasLabel,
        }}
        part="label"
      >
        {label === undefined ? <slot name="label"></slot> : <div class="label-text">{label}</div>}
      </div>
    );
  }

  componentDidRender() {
    this.notchController?.calculateNotchWidth();
  }

  /**
   * Gets any content passed into the `label` slot,
   * not the <slot> definition.
   */
  private get labelSlot() {
    return this.el.querySelector('[slot="label"]');
  }

  /**
   * Returns `true` if label content is provided
   * either by a prop or a content. If you want
   * to get the plaintext value of the label use
   * the `labelText` getter instead.
   */
  private get hasLabel() {
    return this.label !== undefined || this.labelSlot !== null;
  }

  /**
   * Renders the border container
   * when fill="outline".
   */
  private renderLabelContainer() {
    const theme = getIonTheme(this);
    const hasOutlineFill = theme === 'md' && this.fill === 'outline';

    if (hasOutlineFill) {
      /**
       * The outline fill has a special outline
       * that appears around the select and the label.
       * Certain stacked and floating label placements cause the
       * label to translate up and create a "cut out"
       * inside of that border by using the notch-spacer element.
       */
      return [
        <div class="select-outline-container">
          <div class="select-outline-start"></div>
          <div
            class={{
              'select-outline-notch': true,
              'select-outline-notch-hidden': !this.hasLabel,
            }}
          >
            <div class="notch-spacer" aria-hidden="true" ref={(el) => (this.notchSpacerEl = el)}>
              {this.label}
            </div>
          </div>
          <div class="select-outline-end"></div>
        </div>,
        this.renderLabel(),
      ];
    }

    /**
     * If not using the outline style,
     * we can render just the label.
     */
    return this.renderLabel();
  }

  /**
   * Renders either the placeholder
   * or the selected values based on
   * the state of the select.
   */
  private renderSelectText() {
    const { placeholder } = this;

    const displayValue = this.getText();

    let addPlaceholderClass = false;
    let selectText = displayValue;
    if (selectText === '' && placeholder !== undefined) {
      selectText = placeholder;
      addPlaceholderClass = true;
    }

    const selectTextClasses: CssClassMap = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass,
    };

    const textPart = addPlaceholderClass ? 'placeholder' : 'text';

    return (
      <div aria-hidden="true" class={selectTextClasses} part={textPart}>
        {selectText}
      </div>
    );
  }

  /**
   * Renders the chevron icon
   * next to the select text.
   */
  private renderSelectIcon() {
    const { isExpanded, selectExpandedIcon, selectCollapsedIcon } = this;
    let icon = selectCollapsedIcon;

    if (isExpanded) {
      icon = selectExpandedIcon;
    }

    return <ion-icon class="select-icon" part="icon" aria-hidden="true" icon={icon}></ion-icon>;
  }

  private get ariaLabel() {
    const { placeholder, inheritedAttributes } = this;
    const displayValue = this.getText();

    // The aria label should be preferred over visible text if both are specified
    const definedLabel = inheritedAttributes['aria-label'] ?? this.labelText;

    /**
     * If developer has specified a placeholder
     * and there is nothing selected, the selectText
     * should have the placeholder value.
     */
    let renderedLabel = displayValue;
    if (renderedLabel === '' && placeholder !== undefined) {
      renderedLabel = placeholder;
    }

    /**
     * If there is a developer-defined label,
     * then we need to concatenate the developer label
     * string with the current current value.
     * The label for the control should be read
     * before the values of the control.
     */
    if (definedLabel !== undefined) {
      renderedLabel = renderedLabel === '' ? definedLabel : `${definedLabel}, ${renderedLabel}`;
    }

    return renderedLabel;
  }

  private renderListbox() {
    const { disabled, inputId, isExpanded } = this;

    return (
      <button
        disabled={disabled}
        id={inputId}
        aria-label={this.ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={`${isExpanded}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        ref={(focusEl) => (this.focusEl = focusEl)}
      ></button>
    );
  }

  private getShape(): string | undefined {
    const theme = getIonTheme(this);
    const { shape } = this;

    // TODO(ROU-11366): Remove theme check when shapes are defined for all themes.
    if (theme === 'ionic' && shape === undefined) {
      return 'round';
    }

    return shape;
  }

  /**
   * Get the icon to use for the expand icon.
   * If an icon is set on the component, use that.
   * Otherwise, use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get selectExpandedIcon(): string {
    // Return the expandedIcon or toggleIcon if either is explicitly set
    if (this.expandedIcon != null) {
      return this.expandedIcon;
    } else if (this.toggleIcon != null) {
      return this.toggleIcon;
    }

    // Determine the theme and map to default icons
    const theme = getIonTheme(this);
    const defaultIcons = {
      ios: chevronExpand,
      ionic: caretDownRegular,
      md: caretDownSharp,
    };

    // Get the default icon based on the theme, falling back to 'md' icon if necessary
    const defaultIcon = defaultIcons[theme] || defaultIcons.md;

    // Return the configured select expanded icon or the default icon
    return config.get('selectExpandedIcon', defaultIcon);
  }

  /**
   * Get the icon to use for the collapsed icon.
   * If an icon is set on the component, use that.
   * Otherwise, use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get selectCollapsedIcon(): string {
    // Return the toggleIcon if it is explicitly set
    if (this.toggleIcon) {
      return this.toggleIcon;
    }

    // Determine the theme and map to default icons
    const theme = getIonTheme(this);
    const defaultIcons = {
      ios: chevronExpand,
      ionic: caretDownRegular,
      md: caretDownSharp,
    };

    // Get the default icon based on the theme, falling back to 'md' icon if necessary
    const defaultIcon = defaultIcons[theme] || defaultIcons.md;

    return config.get('selectCollapsedIcon', defaultIcon);
  }

  render() {
    const { disabled, el, isExpanded, expandedIcon, labelPlacement, justify, placeholder, fill, name, value } = this;
    const theme = getIonTheme(this);
    const shape = this.getShape();
    const hasFloatingOrStackedLabel = labelPlacement === 'floating' || labelPlacement === 'stacked';
    const shouldRenderOuterIcon = theme !== 'ionic' && hasFloatingOrStackedLabel;
    const shouldRenderInnerIcon = theme === 'ionic' || !hasFloatingOrStackedLabel;
    const justifyEnabled = !hasFloatingOrStackedLabel && justify !== undefined;
    const rtl = isRTL(el) ? 'rtl' : 'ltr';
    const inItem = hostContext('ion-item', this.el);
    const size = this.getSize();
    const shouldRenderHighlight = theme === 'md' && fill !== 'outline' && !inItem;

    const hasValue = this.hasValue();
    const hasStartEndSlots = el.querySelector('[slot="start"], [slot="end"]') !== null;

    renderHiddenInput(true, el, name, parseValue(value), disabled);

    /**
     * If the label is stacked, it should always sit above the select.
     * For floating labels, the label should move above the select if
     * the select has a value, is open, or has anything in either
     * the start or end slot.
     *
     * If there is content in the start slot, the label would overlap
     * it if not forced to float. This is also applied to the end slot
     * because with the default or solid fills, the select is not
     * vertically centered in the container, but the label is. This
     * causes the slots and label to appear vertically offset from each
     * other when the label isn't floating above the input. This doesn't
     * apply to the outline fill, but this was not accounted for to keep
     * things consistent.
     *
     * TODO(FW-5592): Remove hasStartEndSlots condition
     */
    const labelShouldFloat =
      labelPlacement === 'stacked' || (labelPlacement === 'floating' && (hasValue || isExpanded || hasStartEndSlots));

    return (
      <Host
        onClick={this.onClick}
        class={createColorClasses(this.color, {
          [theme]: true,
          'in-item': inItem,
          'in-item-color': hostContext('ion-item.ion-color', el),
          'select-disabled': disabled,
          'select-expanded': isExpanded,
          'has-expanded-icon': expandedIcon !== undefined,
          'has-value': hasValue,
          'label-floating': labelShouldFloat,
          'has-placeholder': placeholder !== undefined,
          'ion-focusable': true,
          [`select-${rtl}`]: true,
          [`select-fill-${fill}`]: fill !== undefined,
          [`select-justify-${justify}`]: justifyEnabled,
          [`select-shape-${shape}`]: shape !== undefined,
          [`select-label-placement-${labelPlacement}`]: true,
          [`select-size-${size}`]: size !== undefined,
        })}
      >
        <label class="select-wrapper" id="select-label">
          {this.renderLabelContainer()}
          <div class="select-wrapper-inner">
            {
              /**
               * For the ionic theme, we render the outline container here
               * instead of higher up, so it can be positioned relative to
               * the native wrapper instead of the <label> element or the
               * entire component. This allows the label text to be positioned
               * above the outline, while staying within the bounds of the
               * <label> element, ensuring that clicking the label text
               * focuses the select.
               */
              theme === 'ionic' && fill === 'outline' && <div class="select-outline"></div>
            }
            <slot name="start"></slot>
            <div class="native-wrapper" ref={(el) => (this.nativeWrapperEl = el)} part="container">
              {this.renderSelectText()}
              {this.renderListbox()}
            </div>
            <slot name="end"></slot>
            {shouldRenderInnerIcon && this.renderSelectIcon()}
          </div>
          {/**
           * The icon in a floating/stacked select
           * must be centered with the entire select,
           * while the start/end slots and native control
           * are vertically offset in the default or
           * solid fills. As a result, we render the
           * icon outside the inner wrapper, which holds
           * those components.
           */}
          {shouldRenderOuterIcon && this.renderSelectIcon()}
          {shouldRenderHighlight && <div class="select-highlight"></div>}
        </label>
      </Host>
    );
  }
}

const getOptionValue = (el: HTMLIonSelectOptionElement) => {
  const value = el.value;
  return value === undefined ? el.textContent || '' : value;
};

const parseValue = (value: any) => {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value.toString();
};

const generateText = (
  opts: HTMLIonSelectOptionElement[],
  value: any | any[],
  compareWith?: string | SelectCompareFn | null
) => {
  if (value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value
      .map((v) => textForValue(opts, v, compareWith))
      .filter((opt) => opt !== null)
      .join(', ');
  } else {
    return textForValue(opts, value, compareWith) || '';
  }
};

const textForValue = (
  opts: HTMLIonSelectOptionElement[],
  value: any,
  compareWith?: string | SelectCompareFn | null
): string | null => {
  const selectOpt = opts.find((opt) => {
    return compareOptions(value, getOptionValue(opt), compareWith);
  });
  return selectOpt ? selectOpt.textContent : null;
};

let selectIds = 0;

const OPTION_CLASS = 'select-interface-option';
