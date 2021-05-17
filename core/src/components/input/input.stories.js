import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Input',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-label ds-name="stacked">Stacked</ion-label>
        <ion-input placeholder="Enter Input"></ion-input>
        <ion-label ds-name="helper">Helper</ion-label>

        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
}

const TemplateSuccess = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <br>
        <ion-input placeholder="Enter Input" success>
          <ion-icon name="med-check-circle">med-check-circle</ion-icon>
        </ion-input>
        <br>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Success = TemplateSuccess.bind({});
Success.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
}

const TemplateFail = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->
        <ion-input placeholder="Enter Input" fail></ion-input>
        <ion-label ds-name="helper" fail>Helper</ion-label>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Fail = TemplateFail.bind({});
Fail.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2101%3A5',
  },
}
