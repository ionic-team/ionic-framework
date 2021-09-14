import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Titulo Materia',
  decorators: [withDesign],
};

const TemplateDefault = ({ dsColor, titulo, descricao }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container" style="text-align: left;">

        <!-- component -->
          <med-titulo-materia .dsColor=${dsColor} .titulo=${titulo} .descricao=${descricao}></med-titulo-materia>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const TituloMateria = TemplateDefault.bind({});
TituloMateria.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/QaJANG4TVrskupANopYUPL/Aulas?node-id=9%3A4201',
  },
}
TituloMateria.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  titulo: {
    control: { type: 'text' },
    description: "Define o título da matéria.",
    defaultValue: 'CAR 1',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  descricao: {
    control: { type: 'text' },
    description: "Define a descrição da matéria.",
    defaultValue: 'Arritimias Cardíacas, Morte Súbita',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
