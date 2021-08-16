import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Rating',
  decorators: [withDesign],
};

const TemplateDefault = ({ nome, data, concurso, texto, dsName, cabe }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-rating .nome=${nome} .data=${data} .concurso=${concurso} .texto=${texto} ds-name=${dsName} ?cabe=${cabe}></med-rating>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Rating = TemplateDefault.bind({});
Rating.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=5308%3A42217',
  },
}
Rating.argTypes = {
  nome: {
    control: { type: 'text' },
    description: "Define o nome do aluno.",
    defaultValue: 'Alex',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  data: {
    control: { type: 'text' },
    description: "Define a data da postagem.",
    defaultValue: '11/8',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  concurso: {
    control: { type: 'text' },
    description: "Define o nome do concurso.",
    defaultValue: 'UFRJ',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  texto: {
    control: { type: 'text' },
    description: "Define o conteúdo de texto.",
    defaultValue: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  dsName: {
    options: [undefined, 'medgrupo', 'banca'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    table: {
      type:  { summary: 'medgrupo | banca' },
      defaultValue: { summary: 'undefined' },
    },
  },
  cabe: {
    disabled: false,
    control: { type: 'boolean' },
    description: 'Define o estado cabe ou não cabe recurso',
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'true' },
    },
  },
};
