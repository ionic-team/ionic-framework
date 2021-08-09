import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { toastController } from '../../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Core/Toast',
  decorators: [withDesign],
};

const createToastrows = async () => {
  toastController.create({
    header: 'Titulo da Notificação.',
    message: 'Corpo ou subtítulo da notificação.',
    position: 'middle',
    showCloseButton: true,
    cssClass:"ion-toast--rows",
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

const TemplateToastRows = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="primary" @click="${createToastrows}">Abrir toast</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const ToastModal= TemplateToastRows.bind({});
ToastModal.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2237%3A5201',
  },
}
