import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { medColors, medNeutrals } from '../../../med-colors';

export default {
  title: 'Components/Core/Titulo Materia',
  decorators: [withDesign],
};

const TemplateDefault = ({ color, neutral, titulo, descricao }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container" style="text-align: left;">

        <!-- component -->
          <med-titulo-materia .color=${color} .neutral=${neutral} .titulo=${titulo} .descricao=${descricao}></med-titulo-materia>
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
  color: {
    options: medColors,
    control: { type: 'inline-radio'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'Color' },
      defaultValue: { summary: 'undefined' },
    },
  },
  neutral: {
    options: medNeutrals,
    control: { type: 'inline-radio'},
    description: "Define a cor neutra do componente.",
    table: {
      type:  { summary: 'Neutrals' },
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
