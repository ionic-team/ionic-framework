import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/ion-button',
  decorators: [withDesign],
};

const Template = () => {
  return html`
  <h2 style="font-family: sans-serif; text-align: center;">
  ⚠️ Para visualizar clique na aba <span style="color: #3a8bd8;">Design</span> abaixo! ⚠️
  </h2>
  `
}

export const Overview = Template.bind({});
Overview.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=717%3A0',
  },
}
