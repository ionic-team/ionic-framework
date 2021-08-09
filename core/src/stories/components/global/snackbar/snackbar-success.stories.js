import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { toastController } from '../../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Core/Snack Bar',
  decorators: [withDesign],
};

const createToastDefaultSuccess = async () => {
  toastController.create({
    color: 'feedback-success',
    header: 'Titulo da Notificação.',
    message: 'Sem conexão. Por favor, tente conectar-se novamente para concluir essa tarefa.',
    position: 'bottom',
    showCloseButton: true,
    cssClass:"",
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

const TemplateDefaultSuccess = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="primary" @click="${createToastDefaultSuccess}">Abrir Snackbar</ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const SnackBarSuccess = TemplateDefaultSuccess.bind({});
SnackBarSuccess.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2237%3A5201',
  },
}
