import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../../constants';

export default {
  title: 'Components/Team/Questões/Cartão Resposta Item',
  decorators: [withDesign],
};

const Template = ({dsColor, anulada, impressa, ativa}) => {
  return html`
      <ion-app>
        <ion-content>
          <div class="flex-center">

            <!-- component -->
            <med-cartao-resposta-lista>
              <med-cartao-resposta-item .dsColor=${dsColor} ?anulada=${anulada} ?impressa=${impressa} ?ativa=${ativa}>01</med-cartao-resposta-item>
            </med-cartao-resposta-lista>
            <!-- component -->

          </div>
        </ion-content>
      </ion-app>
    `
}

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}
Default.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  anulada: {
    control: { type: 'boolean' },
    description: 'Define o estado do componente para anulado.',
    defaultValue: false,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  impressa: {
    control: { type: 'boolean' },
    description: 'Define o estado do componente para impresso.',
    defaultValue: false,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
  ativa: {
    control: { type: 'boolean' },
    description: 'Define o estado do componente para ativo.',
    defaultValue: false,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
