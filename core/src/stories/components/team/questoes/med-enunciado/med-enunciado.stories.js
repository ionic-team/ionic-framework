import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Questões/Enunciado',
  decorators: [withDesign],
};

const TemplateDefault = ({enunciado}) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <med-enunciado>
          ${enunciado}
        </med-enunciado>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const Enunciado = TemplateDefault.bind({});
Enunciado.parameters = {
  design: {
    type: 'figma',
    url: '',
  },
}
Enunciado.argTypes = {
  enunciado: {
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae leo egestas, maximus elit eget, auctor dui. Nunc quis pulvinar magna, at dapibus est. Suspendisse volutpat euismod ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris malesuada semper purus non vehicula. Integer convallis sollicitudin.',
    control: { type: 'text' },
    description: 'Emento definido via slot.'
  },
};
