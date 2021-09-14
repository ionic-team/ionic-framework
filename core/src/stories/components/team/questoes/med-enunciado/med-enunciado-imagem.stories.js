import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Questões/Enunciado',
  decorators: [withDesign],
};

const TemplateDefault = ({enunciado, dsName}) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <med-enunciado ds-name=${dsName} imagens='["https://via.placeholder.com/500", "https://via.placeholder.com/500", "https://via.placeholder.com/500"]'>
          ${enunciado}
        </med-enunciado>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const EnunciadoImagem = TemplateDefault.bind({});
EnunciadoImagem.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=6118%3A45163',
  },
}
EnunciadoImagem.argTypes = {
  enunciado: {
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae leo egestas, maximus elit eget, auctor dui. Nunc quis pulvinar magna, at dapibus est. Suspendisse volutpat euismod ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris malesuada semper purus non vehicula. Integer convallis sollicitudin.',
    control: { type: 'text' },
    description: 'Emento definido via slot.'
  },
  dsName: {
    options: [undefined, 'skin'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    table: {
      type:  { summary: 'skin' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
