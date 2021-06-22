import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { toastController } from '../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Global/Snack Bar',
  decorators: [withDesign],
};

//
// SnackBarTop
//

const createToastTop = async () => {
  toastController.create({
    header: 'Titulo da Notificação.',
    message: 'Sem conexão. Por favor, tente conectar-se novamente para concluir essa tarefa.',
    position: 'top',
    showCloseButton: true,
    buttons: [
    {
      side: 'start',
      icon: 'med-information',
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

const TemplateDefaultTop = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="primary" @click="${createToastTop}">Abrir Snackbar</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const SnackBarTop = TemplateDefaultTop.bind({});
SnackBarTop.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2237%3A5201',
  },
}
