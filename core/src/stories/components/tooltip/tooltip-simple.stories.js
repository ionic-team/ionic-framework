import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import {popoverController} from '../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Global/Tooltip',
  decorators: [withDesign],
};

let call = false
let currentPopover = null;

const createSimplePopover = async (ev) => {
  popoverController.create({
    component: 'med-tooltip',
    cssClass: 'med-tooltip',
    showBackdrop: false,
    componentProps: {
      content: 'Tooltip Simples',
    },
    mode: 'ios',
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

const TemplateSimple = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-icon name="med-information" @click="${createSimplePopover}" style="cursor: pointer;"></ion-icon>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const TooltipSimple = TemplateSimple.bind({});
TooltipSimple.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}
