import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Button',
  decorators: [withDesign],
};

const TemplateIconOnly = ({ disabled, size, platform }) => {
  if (platform === 'Mobile') {
    document.querySelector('html').classList.remove('plt-desktop');
  } else if (platform === 'Desktop') {
    document.querySelector('html').classList.add('plt-desktop');
  }

  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-button ds-name="icon-only" ?disabled=${disabled} ds-size=${size}>
          <ion-icon slot="icon-only" name="med-chevron-left"></ion-icon>
        </ion-button>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const IconOnly = TemplateIconOnly.bind({});
IconOnly.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1615%3A3',
  },
}
IconOnly.argTypes = {
  disabled: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o comportamento disabled do botão.'
  },
  size: {
    defaultValue: 'none',
    options: ['none', 'xs', 'sm', 'md', 'lg'],
    control: { type: 'radio'},
    description: "Define os tamanhos 'xs', 'sm', 'md' e 'lg' dos botões."
  },
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Usado apenas no storybook para visualização.**'
  },
};
