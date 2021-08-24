import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/Toolbar',
  decorators: [withDesign],
};

const TemplateToolbar = ({ color, neutral, platform }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
    document.querySelector('html').classList.remove('plt-electron');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
    document.querySelector('html').classList.add('plt-electron');
  }

  return html `
    <ion-app>

      <!-- component -->
      <med-toolbar .color=${color} .neutral=${neutral}>
        <ion-button ds-name="icon-only" slot="start">
          <ion-icon class="med-icon" slot="icon-only" name="med-setaesquerda"></ion-icon>
        </ion-button>
        <ul>
          <li>
            <ion-button ds-name="icon-only">
              <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon class="med-icon" slot="icon-only" name="med-visivel"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon class="med-icon" slot="icon-only" color="brand" name="med-editar"></ion-icon>
            </ion-button>
            <ion-button ds-name="icon-only">
              <ion-icon class="med-icon med-neutral med-neutral-4" slot="icon-only" name="med-fonte"></ion-icon>
            </ion-button>
          </li>
        </ul>
        <ion-button ds-name="icon-only" slot="end">
          <ion-icon class="med-icon" slot="icon-only" name="med-setadireita"></ion-icon>
        </ion-button>
      </med-toolbar>
      <!-- component -->

    </ion-app>
  `
}

export const Toolbar = TemplateToolbar.bind({});
Toolbar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
}
Toolbar.argTypes = {
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
  color: {
    options: medColors,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  neutral: {
    options: medNeutrals,
    control: { type: 'select'},
    description: "Define a cor neutral do componente.",
    table: {
      type:  { summary: 'Neutrals' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
