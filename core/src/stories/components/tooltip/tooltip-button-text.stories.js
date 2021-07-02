import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import {popoverController} from '../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Global/Tooltip',
  decorators: [withDesign],
};

let call = false
let currentPopover = null;

const createButtonTextPopover = async (ev) => {
  popoverController.create({
    component: 'med-tooltip',
    cssClass: 'med-tooltip',
    showBackdrop: false,
    componentProps: {
      header: 'Título do Tutorial',
      content: 'Este é um exemplo de tootip em parágrafo. Esse box contém o tamanho máximo de texto que pode ser exibido. Acima disso, utilize um modal.',
      buttonLeft: {
        label: 'Pular tutorial',
      },
      buttonRight: {
        label: 'Confirmar e encerrar',
      }
    },
    mode: 'ios',
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

const TemplateButtonText = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-icon name="med-information" @click="${createButtonTextPopover}" style="cursor: pointer;"></ion-icon>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const TooltipButtonText = TemplateButtonText.bind({});
TooltipButtonText.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}
