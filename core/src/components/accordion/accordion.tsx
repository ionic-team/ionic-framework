import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { addEventListener, removeEventListener } from '../../utils/helpers';
import { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot header - Content is placed at the top and is used to
 * expand or collapse the accordion item.
 * @slot content - Content is placed below the header and is
 * shown or hidden based on expanded state.
 *
 * @part header - The wrapper element for the header slot.
 * @part content - The wrapper element for the content slot.
 * @part expanded - The expanded element. Can be used in combination
 * with the `header` and `content` parts (i.e. `::part(header expanded)`).
 */
@Component({
  tag: 'ion-accordion',
  styleUrl: 'accordion.scss',
  shadow: true
})
export class Accordion implements ComponentInterface {
  private accordionGroupEl?: HTMLIonAccordionGroupElement | null;

  @Element() el?: HTMLElement;

  @State() expanded: boolean = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The value of the accordion.
   */
  @Prop() value?: string;

  /**
   * If `true`, the accordion cannot be interacted with.
   */
  @Prop() disabled = false;

  /**
   * Describes the expansion behavior for each accordion.
   * Possible values are `"float"`, `"inset"`, `"accordion"`,
   * and `"popout"`. Defaults to `"float"`.
   */
  @Prop() expand: 'float' | 'inset' | 'accordion' | 'popout' = 'float';

  /**
   * Emitted when the accordion loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the accordion has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  connectedCallback() {
    const accordionGroupEl = this.accordionGroupEl = this.el && this.el.closest('ion-accordion-group');
    if (accordionGroupEl) {
      addEventListener(accordionGroupEl, 'ionChange', this.updateState);
    }
  }

  disconnectedCallback() {
    const accordionGroupEl = this.accordionGroupEl;
    if (accordionGroupEl) {
      removeEventListener(accordionGroupEl, 'ionChange', this.updateState);
    }
  }

  private updateState = (ev: CustomEvent) => {
    console.log('updated state', ev)
  }

  private toggleExpanded() {
    const { accordionGroupEl, value, expanded } = this;
    if (accordionGroupEl) {
      accordionGroupEl.requestAccordionToggle(value, !expanded);
      console.log('toggle expanded')
    }
  }

  render() {
    const { expanded, expand } = this;
    const headerPart = expanded ? 'header expanded' : 'header';
    const contentPart = expanded ? 'content expanded' : 'content';

    return (
      <Host
        class={{
          [`accordion-expand-${expand}`]: true,
          ['accordion-expanded']: expanded
        }}
      >
        <button
          onClick={() => this.toggleExpanded()}
          class="header"
          part={headerPart}
        >
          <slot name="header"></slot>
        </button>

        <div
          class="content"
          part={contentPart}
        >
          <slot name="content"></slot>
        </div>
      </Host>
    );
  }
}
