import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { popoverController } from '../../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Core/Popover',
  decorators: [withDesign],
};

let call = false
let currentPopover = null;

const createPopover = async (ev) => {
  popoverController.create({
    component: 'med-popover',
    cssClass: 'med-popover',
    mode: 'ios',
    translucent: true,
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

customElements.define('med-popover', class ModalContent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-range max="5">
        <ion-icon class="med-icon" slot="start" size="small" name="med-font-decrease"></ion-icon>
        <ion-icon class="med-icon" slot="end" name="med-font-increase"></ion-icon>
      </ion-range>
    `;
  }
});

const TemplateDefault = () => {
  return html`
    <ion-app>
      <ion-content class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="primary" @click="${createPopover}">click me</ion-button>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const Popover = TemplateDefault.bind({});
Popover.parameters = {
  design: {
    type: 'figma',
    url: '',
  },
}
