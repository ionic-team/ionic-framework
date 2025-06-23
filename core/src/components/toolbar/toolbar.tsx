import type { ComponentInterface } from '@stencil/core';
import { Component, Element, forceUpdate, h, Host, Listen, Prop } from '@stencil/core';
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
    this.updateSlotWidths();
  }

  /**
   * Updates the CSS custom properties for slot widths
   * This ensures that slots shown by their met conditions
   * have a minimum width matching their required slot
   */
  private updateSlotWidths(tries: number = 0) {
    // Set timeout to try to execute after everything is rendered
    setTimeout(() => {
      // Attempt to measure and update
      const success = this.measureAndUpdateSlots();

      // If not all measurements were successful, try again in 100 ms
      // cap recursion at 5 tries for safety
      if (!success && tries < 5) {
        setTimeout(() => {
          this.updateSlotWidths(tries + 1);
        }, 100);
      }
    });
  }

  /**
   * Measure the widths of the slots and update the CSS custom properties
   * for the minimum width of each pair of slots based on the largest width in each pair.
   * Returns whether we successfully measured all of the slots we expect to have content.
   * If not, the content probably hasn't rendered yet and we need to try again.
   */
  private measureAndUpdateSlots(): boolean {
    // Define the relationship between slots based on the conditions array
    // Group slots that should have the same width
    const slotPairs = [
      { name: 'start-end', slots: ['start', 'end'] },
      { name: 'primary-secondary', slots: ['primary', 'secondary'] },
    ];

    // First, measure all slot widths
    const slotWidths = new Map<string, number>();
    let allMeasurementsSuccessful = true;

    // Measure all slots with content
    const slots = ['start', 'end', 'primary', 'secondary'];
    slots.forEach((slot) => {
      if (this.el.classList.contains(`has-${slot}-content`)) {
        const slotElement = this.el.shadowRoot?.querySelector(`slot[name="${slot}"]`) as HTMLElement | null;
        if (slotElement) {
          // Temporarily allow slot to size to content by setting flex-basis
          // to 'auto'. This ensures that slotted content (like images) can
          // render at their intrinsic width for measurement.
          const { name } = slotPairs.find((pair) => pair.slots.includes(slot))!;
          this.el.style.setProperty(`--${name}-size`, 'auto');

          const width = slotElement.offsetWidth;

          // Set the slot size variable to the measured width
          if (width > 0) {
            this.el.style.setProperty(`--${name}-size`, `${width}px`);
            slotWidths.set(slot, width);
          } else {
            allMeasurementsSuccessful = false;
          }
        }
      }
    });

    // Then set the CSS custom properties based on the largest width in each pair
    slotPairs.forEach(({ name, slots }) => {
      // Find the maximum width among the slots in this pair
      let maxWidth = 0;
      let hasAnyContent = false;

      slots.forEach((slot) => {
        if (slotWidths.has(slot)) {
          hasAnyContent = true;
          maxWidth = Math.max(maxWidth, slotWidths.get(slot) ?? 0);
        }
      });

      // If at least one slot in the pair has content, set the min-width for the pair
      if (hasAnyContent && maxWidth > 0) {
        // Set a single CSS variable for the pair
        this.el.style.setProperty(`--${name}-size`, `${maxWidth}px`);
      }
    });

    return allMeasurementsSuccessful;
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
        classesToRemove.push(className);
      }
    });

    // Add classes to the toolbar element
    this.el.classList.add(...classesToAdd);
    this.el.classList.remove(...classesToRemove);

    // Update slot widths after classes have been updated
    this.updateSlotWidths();
  }

  private hasSlotContent(slotName: string): boolean {
    const slotNode = this.el.shadowRoot?.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement | null;
    return !!slotNode && slotNode.assignedNodes().length > 0;
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
    const theme = getIonTheme(this);
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
          <slot name="start" onSlotchange={() => this.updateSlotClasses}></slot>
          <slot name="secondary" onSlotchange={() => this.updateSlotClasses}></slot>
          <div class="toolbar-content" part="content">
            <slot></slot>
          </div>
          <slot name="primary" onSlotchange={() => this.updateSlotClasses}></slot>
          <slot name="end" onSlotchange={() => this.updateSlotClasses}></slot>
        </div>
      </Host>
    );
  }
}
