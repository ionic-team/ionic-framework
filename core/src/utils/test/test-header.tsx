import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { getIonMode } from 'src/global/ionic-global';

@Component({
  tag: 'test-header',
  styleUrl: 'test-header.scss',
  scoped: true,
})
export class TestHeader implements ComponentInterface {
  @Prop() testTitle?: string;

  locale = document.querySelector('#locale');

  setTheme = (ev: CustomEvent) => {
    window.location.search = `?ionic:theme=${ev.detail.value}`;
  };

  toggleDir = (ev: CustomEvent) => {
    if (ev.detail.checked) {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  };

  togglePalette = (ev: CustomEvent) => {
    const paletteLinkEl = document.getElementById('palette');
    if (ev.detail.checked) {
      paletteLinkEl?.setAttribute('href', 'https://cdn.jsdelivr.net/npm/@ionic/core@next/css/palettes/dark.always.css');
      paletteLinkEl?.setAttribute('rel', 'stylesheet');
      paletteLinkEl?.setAttribute('type', 'text/css');
    } else {
      paletteLinkEl?.removeAttribute('href');
      paletteLinkEl?.removeAttribute('rel');
      paletteLinkEl?.removeAttribute('type');
    }
  };

  render() {
    return (
      <Host class={getIonMode(this)}>
        <ion-header translucent={true}>
          <ion-toolbar>
            <ion-title>{this.testTitle}</ion-title>
            <ion-buttons slot="end">
              <ion-button id="popover-trigger">Options</ion-button>
            </ion-buttons>
            {/* @ts-ignore */}
            <ion-popover class="options-popover" trigger="popover-trigger">
              <ion-list lines="none">
                <ion-item>
                  <ion-toggle onIonChange={this.togglePalette}>Dark Mode</ion-toggle>
                </ion-item>
                <ion-item>
                  <ion-toggle onIonChange={this.toggleDir}>RTL</ion-toggle>
                </ion-item>
                {/* <ion-item detail={true} href="?ionic:mode=ios">
                  <ion-label>iOS Mode</ion-label>
                </ion-item>
                <ion-item detail={true} href="?ionic:mode=md">
                  <ion-label>MD Mode</ion-label>
                </ion-item> */}
                <ion-item>
                  <ion-select onIonChange={this.setTheme} interface="popover" placeholder="Theme">
                    <ion-select-option value="ios">iOS Theme</ion-select-option>
                    <ion-select-option value="md">MD Theme</ion-select-option>
                    <ion-select-option value="ionic">Ionic Theme</ion-select-option>
                  </ion-select>
                </ion-item>

                <slot name="items"></slot>
              </ion-list>
            </ion-popover>
          </ion-toolbar>
        </ion-header>
        <link id="palette" />
      </Host>
    );
  }
}
