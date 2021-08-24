import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Tooltip',
  decorators: [withDesign],
};

const Template = ({ collapsed, placement, position, content }) => {
  return html`
    <ion-app style="align-items: center; justify-content: center;">

      <!-- component -->
      <med-tooltip .content=${content} .collapsed=${collapsed} .placement=${placement} .position=${position}>
        <ion-icon slot="icon" class="med-icon" name="med-context-menu"></ion-icon>

          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>
          <p>asihjdgasidhgasidhgasdhigas</p>

      </med-tooltip>
      <!-- component -->

    </ion-app>
  `
}

export const Default = Template.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2781%3A8634',
  },
}
Default.argTypes = {
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
    description: "Define posicionamento em relação ao ícone.",
    table: {
      type:  { summary: 'top | bottom | left | right' },
      defaultValue: { summary: 'undefined' },
    },
  },
  position: {
    options: [undefined, 'start', 'center', 'end'],
    control: { type: 'radio'},
    description: "Define posicionamento horizontal do componente.",
    table: {
      type:  { summary: 'start | center | end' },
      defaultValue: { summary: 'undefined' },
    },
  },
  content: {
    control: { type: 'text' },
    defaultValue: 'Tooltip Simples',
  },
};
