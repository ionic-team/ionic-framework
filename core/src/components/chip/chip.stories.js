import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Global/Chip',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->

        <ion-chip>
          <ion-label >teste 123</ion-label>
        </ion-chip>

        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}

const TemplateIcon = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->

        <ion-chip>
          <ion-label >teste 123</ion-label>
          <ion-icon name="med-check-circle">med-check-circle</ion-icon>
        </ion-chip>

        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Icon = TemplateIcon.bind({});
Icon.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}

const TemplateAvatar = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->

        <ion-chip>
          <ion-icon name="med-check-circle">med-check-circle</ion-icon>
          <ion-label >teste 123</ion-label>
        </ion-chip>

        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Avatar = TemplateAvatar.bind({});
Avatar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}

const TemplateDual = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->

        <ion-chip>
          <ion-icon name="med-check-circle">med-check-circle</ion-icon>
          <ion-label >teste 123</ion-label>
          <ion-icon name="med-check-circle">med-check-circle</ion-icon>
        </ion-chip>

        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Dual = TemplateDual.bind({});
Dual.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}

const TemplateOutline = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->

          <ion-chip outline>
            <ion-label >teste 123</ion-label>
          </ion-chip>

        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Outline = TemplateOutline.bind({});
Outline.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}

const TemplateColor = () => {
  return html`
    <ion-app class="storybook-only">
      <div class="storybook-only__container">

        <!-- component -->

        <ion-chip color>
          <ion-label >teste 123</ion-label>
        </ion-chip>

        <!-- component -->

      </div>
    </ion-app>
  `
}

export const Color = TemplateColor.bind({});
Color.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=1981%3A4566',
  },
}
