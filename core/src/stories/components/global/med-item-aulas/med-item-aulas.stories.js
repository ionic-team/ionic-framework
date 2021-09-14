import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Item Aulas',
  decorators: [withDesign],
};

const TemplateDefault = ({ dsColor, professor, porcentagem, videos}) => {

  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <med-item-aulas .dsColor=${dsColor} .professor=${professor} .porcentagem=${porcentagem} .videos=${videos}>
          <med-avatar ds-size="lg" letter="A" slot="avatar"></med-avatar>
          <med-rate-result excelente="10" bom="20" regular="30" ruim="40" slot="rate"></med-rate-result>
        </med-item-aulas>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const ItemAulas = TemplateDefault.bind({});
ItemAulas.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/QaJANG4TVrskupANopYUPL/Aulas?node-id=6%3A10088',
  },
}
ItemAulas.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  professor: {
    control: { type: 'text' },
    description: "Define o nome do professor.",
    defaultValue: 'Felipe Marinho Bastos',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  porcentagem: {
    control: { type: 'text' },
    description: "Define a porcentagem de visualização de vídeos.",
    defaultValue: '20',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  videos: {
    control: { type: 'text' },
    description: "Define a quantidade de vídeos.",
    defaultValue: '15',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
