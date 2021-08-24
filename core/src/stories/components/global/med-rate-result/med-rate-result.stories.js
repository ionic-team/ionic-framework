import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Rate Result',
  decorators: [withDesign],
};

const TemplateDefault = ({ excelente, bom, regular, ruim }) => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <med-rate-result .excelente=${excelente} .bom=${bom} .regular=${regular} .ruim=${ruim}></med-rate-result>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const RateResult = TemplateDefault.bind({});
RateResult.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/QaJANG4TVrskupANopYUPL/Aulas?node-id=6%3A12222',
  },
}
RateResult.argTypes = {
  excelente: {
    control: { type: 'text' },
    description: "Define numero de votos excelentes",
    defaultValue: '312',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  bom: {
    control: { type: 'text' },
    description: "Define numero de votos bons",
    defaultValue: '4124',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  regular: {
    control: { type: 'text' },
    description: "Define numero de votos regulares",
    defaultValue: '22',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  ruim: {
    control: { type: 'text' },
    description: "Define numero de votos ruins",
    defaultValue: '1',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
