import { Component, ComponentInterface, Host, h, Element, Prop, Event, EventEmitter } from '@stencil/core';

import { AnchorInterface, ButtonInterface } from '../../utils/element-interface';
import { hasShadowDom } from '../../utils/helpers';

@Component({
  tag: 'med-button',
  styleUrl: 'med-button.scss',
  shadow: true,
})
export class MedButton implements ComponentInterface, AnchorInterface, ButtonInterface {
  @Element() el!: HTMLElement;

  @Prop() href: string | undefined;

  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  @Prop({ reflect: true }) disabled = false;

  @Prop() target: string | undefined;

  @Prop() download: string | undefined;

  @Prop() rel: string | undefined;

  @Event() medFocus!: EventEmitter<void>;

  @Event() medBlur!: EventEmitter<void>;

  private onFocus(): void {
    this.medFocus.emit();
  }

  private onBlur(): void {
    this.medBlur.emit();
  }

  private onClick(event: Event): void {
    if (hasShadowDom(this.el)) {
      const form = this.el.closest('form');
      if (form) {
        event.preventDefault();
        const fakeButton = document.createElement('button');
        fakeButton.type = this.type;
        fakeButton.style.display = 'none';
        form.appendChild(fakeButton);
        fakeButton.click();
        fakeButton.remove();
      }
    }
  }

  render() {
    const { href, type, disabled, target, download, rel } = this;
    const TagType = href ? 'a' : ('button' as any);
    const attrs =
      TagType === 'button'
        ? {
            type,
            disabled,
          }
        : {
            href,
            target,
            download,
            rel,
          };

    return (
      <Host
        from-stencil
        class={{
          'med-focusable': true,
          'med-activatable': true,
          'med-disabled': disabled,
        }}
        aria-disabled={disabled ? 'true' : null}
        onClick={this.onClick.bind(this)}
      >
        <TagType
          class="native"
          {...attrs}
          tabindex={TagType === 'a' && disabled ? '-1' : null}
          aria-disabled={TagType === 'a' && disabled ? 'true' : null}
          role={TagType === 'a' ? 'button' : null}
          part="native"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          <span class="inner" part="inner">
            <slot></slot>
          </span>
        </TagType>
      </Host>
    );
  }
}
