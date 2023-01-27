import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Method, Prop, h } from '@stencil/core';

@Component({
  tag: 'std-action-sheet-button',
  styleUrl: 'std-action-sheet-button.scss',
  shadow: true
})
export class StdActionSheetButton implements ComponentInterface {
  private actionSheet!: HTMLStdActionSheetElement | null;

  @Element() el!: HTMLStdActionSheetButtonElement;

  @Prop() role?: 'cancel' | 'destructive';

  @Prop() data?: any;

  connectedCallback() {
    this.actionSheet = this.el.closest('std-action-sheet');
  }

  disconnectedCallback() {
    this.actionSheet = null;
  }

  private dismiss = () => {
    const { role, data } = this;

    if (this.actionSheet) {
      this.actionSheet.dismiss(data, role);
    }
  }

  render() {
    return (
      <Host
        onClick={this.dismiss}
      >
        <slot></slot>
      </Host>
    );
  }
}
