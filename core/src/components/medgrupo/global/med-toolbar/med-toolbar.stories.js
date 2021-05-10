import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Toolbar',
  decorators: [withDesign],
};

const TemplateToolbar = ({ platform }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html `
    <ion-app>

      <!-- component -->
      <med-toolbar>
        <ion-button ds-name="icon-only" slot="start">
          <ion-icon slot="icon-only" name="med-arrow-left-circle"></ion-icon>
        </ion-button>
        <ul>
          <li>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-star-outline"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-eye-show-line"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-notes"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon slot="icon-only" name="med-font-size"></ion-icon>
            </ion-button>
          </li>
        </ul>
        <ion-button ds-name="icon-only" slot="end">
          <ion-icon slot="icon-only" name="med-arrow-right-circle"></ion-icon>
        </ion-button>
      </med-toolbar>
      <!-- component -->

    </ion-app>
  `
}

export const Default = TemplateToolbar.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
}
Default.argTypes = {
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};
