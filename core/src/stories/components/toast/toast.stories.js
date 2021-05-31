import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { toastController } from '../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Global/Toast',
  decorators: [withDesign],
};

const createToastFloatBottom = async () => {
  toastController.create({
    header: 'Titulo da Notificação.',
    message: 'Corpo ou subtítulo da notificação.',
    position: 'bottom',
    showCloseButton: true,
    cssClass:"ion-toast--float",
    buttons: [
    {
      side: 'start',
      icon: 'med-information',
      text: '',
      handler: () => {
        console.log('clicked');
      }
    },
    {
      text: 'tente novamente',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    },
    {
      side: 'end',
      icon: 'med-close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }
  ]
  }).then((toast) => {
    toast.present()
  })
}

const TemplateFloatBottom = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="primary" @click="${createToastFloatBottom}">Abrir toast</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Toast = TemplateFloatBottom.bind({});
Toast.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2237%3A5201',
  },
}
