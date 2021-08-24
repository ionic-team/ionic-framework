import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Vote',
  decorators: [withDesign],
};

const Template = ({ titulo: titulo, like: like, unlike: unlike }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <med-vote .titulo=${titulo} .like=${like} .unlike=${unlike}></med-vote>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Vote = Template.bind({});
Vote.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=5404%3A38994',
  },
}
Vote.argTypes = {
  titulo: {
    control: { type: 'text' },
    description: "Define o titulo do componente.",
    defaultValue: 'Cabe recurso?',
  },
  like: {
    control: { type: 'text' },
    description: "Define a quantidade de recursos que cabem.",
    defaultValue: '2',
  },
  unlike: {
    control: { type: 'text' },
    description: "Define a quantidade de recursos que cabem.",
    defaultValue: '4',
  },
};
