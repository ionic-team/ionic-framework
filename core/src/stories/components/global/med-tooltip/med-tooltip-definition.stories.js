import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Tooltip',
  decorators: [withDesign],
};

const Template = ({ collapsed, placement, position, titulo, content, dsColor }) => {
  return html`
    <ion-app style="align-items: center; justify-content: center;">

      <!-- component -->
      <med-tooltip .dsColor=${dsColor} ds-name="definition" .titulo=${titulo} .content=${content} .collapsed=${collapsed} .placement=${placement} .position=${position}>
        <ion-icon slot="icon" class="med-icon med-tooltip__icon" name="med-context-menu"></ion-icon>
      </med-tooltip>
      <!-- component -->

    </ion-app>
  `
}

export const Definition = Template.bind({});
Definition.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2781%3A8634',
  },
}
Definition.argTypes = {
  dsColor: {
    options: MedColor,
    control: { type: 'select'},
    description: "Define a cor do componente.",
    table: {
      type:  { summary: 'MedColor' },
      defaultValue: { summary: 'undefined' },
    },
  },
  collapsed: {
    control: { type: 'boolean' },
    description: 'Define o estado do componente.',
    defaultValue: true,
    table: {
      type:  { summary: 'boolean' },
      defaultValue: { summary: 'true' },
    },
  },
  placement: {
    options: [undefined, 'top', 'bottom', 'left', 'right'],
    control: { type: 'radio'},
    description: "Define a variação de tamanho componente.",
    table: {
      type:  { summary: 'top | bottom | left | right' },
      defaultValue: { summary: 'undefined' },
    },
  },
  position: {
    options: [undefined, 'start', 'center', 'end'],
    control: { type: 'radio'},
    description: "Define a variação de tamanho componente.",
    table: {
      type:  { summary: 'start | center | end' },
      defaultValue: { summary: 'undefined' },
    },
  },
  titulo: {
    control: { type: 'text' },
    defaultValue: 'Título do Tutorial.',
  },
  content: {
    control: { type: 'text' },
    defaultValue: 'Este é um exemplo de tootip em parágrafo. Esse box contém o tamanho máximo de texto que pode ser exibido. Acima disso, utilize um modal.',
  },
};
