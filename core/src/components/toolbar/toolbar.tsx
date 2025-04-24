import type { ComponentInterface } from '@stencil/core';
import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Listen,
  Prop,
} from '@stencil/core';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color, CssClassMap, StyleEventDetail } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the toolbar text in LTR, and to the right in RTL.
 * @slot secondary - Content is placed to the left of the toolbar text in the `"ios"` theme, and directly to the right in the `"md"` theme.
 * @slot primary - Content is placed to the right of the toolbar text in the `"ios"` theme, and to the far right in the `"md"` theme.
 * @slot end - Content is placed to the right of the toolbar text in LTR, and to the left in RTL.
 *
 * @part background - The background of the toolbar, covering the entire area behind the toolbar content.
 * @part container - The container that wraps all toolbar content, including the default slot and named slot content.
 * @part content - The container for the default slot, wrapping content provided without a named slot.
 */
@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss',
    ionic: 'toolbar.ionic.scss',
  },
  shadow: true,
})
export class Toolbar implements ComponentInterface {
  private childrenStyles = new Map<string, CssClassMap>();

  @Element() el!: HTMLIonToolbarElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  componentWillLoad() {
    const buttons = Array.from(this.el.querySelectorAll('ion-buttons'));

    const firstButtons = buttons.find((button) => {
      return button.slot === 'start';
    });
    if (firstButtons) {
      firstButtons.classList.add('buttons-first-slot');
    }

    const buttonsReversed = buttons.reverse();
    const lastButtons =
      buttonsReversed.find((button) => button.slot === 'end') ||
      buttonsReversed.find((button) => button.slot === 'primary') ||
      buttonsReversed.find((button) => button.slot === 'secondary');
    if (lastButtons) {
      lastButtons.classList.add('buttons-last-slot');
    }

    this.updateSlotClasses();
  }

  componentDidLoad() {
    this.updateSlotClasses();
  }

  private updateSlotClasses() {
    // Check if slots have content
    const slots = ['start', 'end', 'primary', 'secondary'];

    const classesToAdd: string[] = [];
    const classesToRemove: string[] = [];
    slots.forEach((slot) => {
      const slotHasContent = this.hasSlotContent(slot);
      const slotClass = `has-${slot}-content`;
      if (slotHasContent) {
        classesToAdd.push(slotClass);
      } else {
        classesToRemove.push(slotClass);
      }
    });

    // Force visibilities in certain conditions. This works by adding a class to the toolbar
    // named `show-{slot}`. This class will be added if the toolbar has the required slots
    // and does not have any of the excluded slots, otherwise it will be removed.
    // This is useful to enforce centering of the toolbar content when there are different amounts
    // of slots on either side of the toolbar.
    const conditions = [
      { name: 'end', requiredSlots: ['start'], excludeSlots: ['end', 'primary'] },
      { name: 'start', requiredSlots: ['end'], excludeSlots: ['start', 'secondary'] },
      { name: 'secondary', requiredSlots: ['primary'], excludeSlots: ['secondary', 'start'] },
      { name: 'primary', requiredSlots: ['secondary'], excludeSlots: ['primary', 'end'] },
    ];
    conditions.forEach((condition) => {
      const hasRequiredSlots = condition.requiredSlots.every((slot) => classesToAdd.includes(`has-${slot}-content`));
      const hasExcludedSlots = condition.excludeSlots.some((slot) => classesToAdd.includes(`has-${slot}-content`));
      const className = `show-${condition.name}`;

      if (hasRequiredSlots && !hasExcludedSlots) {
        classesToAdd.push(className);
      } else {
        this.el.classList.remove(className);
      }
    });

    // Add classes to the toolbar element
    this.el.classList.add(...classesToAdd);
    this.el.classList.remove(...classesToRemove);
  }

  private hasSlotContent(slotName: string): boolean {
    const slotNode = this.el.shadowRoot?.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement | null;
    if (slotNode) {
      const assigned = slotNode.assignedNodes();
      return assigned.length > 0;
    }
    return false;
  }

  @Listen('ionStyle')
  childrenStyle(ev: CustomEvent<StyleEventDetail>) {
    ev.stopPropagation();

    const tagName = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail;
    const newStyles = {} as CssClassMap;
    const childStyles = this.childrenStyles.get(tagName) || {};

    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach((key) => {
      const childKey = `toolbar-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== childStyles[childKey]) {
        hasStyleChange = true;
      }
      if (newValue) {
        newStyles[childKey] = true;
      }
    });

    if (hasStyleChange) {
      this.childrenStyles.set(tagName, newStyles);
      forceUpdate(this);
    }
  }

  render() {
    const theme = getIonTheme(this.el);
    const childStyles = {};
    this.childrenStyles.forEach((style) => {
      Object.assign(childStyles, style);
    });

    return (
      <Host
        class={{
          ...createColorClasses(this.color, {
            [theme]: true,
            'in-toolbar': hostContext('ion-toolbar', this.el),
          }),
          ...childStyles,
        }}
      >
        <div class="toolbar-background" part="background"></div>
        <div class="toolbar-container" part="container">
          <slot name="start"></slot>
          <slot name="secondary"></slot>
          <div class="toolbar-content" part="content">
            <slot></slot>
          </div>
          <slot name="primary"></slot>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
