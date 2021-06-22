import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import {popoverController} from '../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Global/Tooltip',
  decorators: [withDesign],
};

let call = false
let currentPopover = null;

const createButtonIconPopover = async (ev) => {
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
        icon: 'med-arrow-right-circle'
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

const TemplateButtonIcon = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-icon color="dark-30" name="med-information" @click="${createButtonIconPopover}" style="cursor: pointer;"></ion-icon>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const TooltipButtonIcon = TemplateButtonIcon.bind({});
TooltipButtonIcon.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}
