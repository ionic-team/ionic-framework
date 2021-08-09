import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Textarea',
  decorators: [withDesign],
};

const TemplateSuccess = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
          <ion-label ds-name="stacked">Stacked</ion-label>
          <ion-textarea placeholder="Digite o texto aqui." success></ion-textarea>
          <ion-label ds-name="helper">Helper</ion-label>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const TextareaSuccess = TemplateSuccess.bind({});
TextareaSuccess.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A6',
  },
};
