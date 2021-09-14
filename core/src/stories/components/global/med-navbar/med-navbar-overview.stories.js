import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Navbar',
  decorators: [withDesign],
};

const Template = ({ color, neutral, dsName, platform }) => {
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
      <med-navbar ds-name=${dsName}>
        <ion-button ds-name="tertiary" slot="left">
          <ion-icon class="med-icon" name="med-esquerda"></ion-icon>
          voltar
        </ion-button>

        <h1 slot="title">header</h1>
        <h2 slot="subtitle">subheader</h2>

        <ion-button ds-name="tertiary" slot="right">
          <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
        </ion-button>
      </med-navbar>
      <!-- component -->

    </ion-app>
  `
}

export const Overview = Template.bind({});
Overview.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=404%3A0',
  },
}
Overview.argTypes = {
  dsName: {
    options: [undefined, 'secondary', 'transparent'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    table: {
      type:  { summary: 'secondary | transparent' },
      defaultValue: { summary: 'undefined' },
    },
  },
  platform: {
    defaultValue: 'Desktop',
    options: ['Desktop', 'Mobile'],
    control: { type: 'radio' },
    description: 'Muda a visualização do componente entre plataformas. **Atributo utilizado apenas no storybook. Não é um atributo do componente!.**'
  },
}
