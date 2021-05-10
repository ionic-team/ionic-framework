import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Cartão Resposta Item',
  decorators: [withDesign],
};

const TemplateDefault = () => {
  return html`
    <ion-app>
      <ion-content style="--background: var(--med-color-neutral-dark-prime);">

        <!-- component -->
        <med-cartao-resposta-lista>

          <med-cartao-resposta-item>01</med-cartao-resposta-item>

        </med-cartao-resposta-lista>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}

const TemplateActive = () => {
  return html`
    <ion-app>
      <ion-content style="--background: var(--med-color-neutral-dark-prime);">

        <!-- component -->
        <med-cartao-resposta-lista>

          <med-cartao-resposta-item active>01</med-cartao-resposta-item>

        </med-cartao-resposta-lista>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const Active = TemplateActive.bind({});
Active.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}

const TemplateCorreta = () => {
  return html`
    <ion-app>
      <ion-content style="--background: var(--med-color-neutral-dark-prime);">

        <!-- component -->
        <med-cartao-resposta-lista>

          <med-cartao-resposta-item color="success-medium">01</med-cartao-resposta-item>

        </med-cartao-resposta-lista>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const Correta = TemplateCorreta.bind({});
Correta.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}

const TemplateIncorreta = () => {
  return html`
    <ion-app>
      <ion-content style="--background: var(--med-color-neutral-dark-prime);">

        <!-- component -->
        <med-cartao-resposta-lista>

          <med-cartao-resposta-item color="error-medium">01</med-cartao-resposta-item>

        </med-cartao-resposta-lista>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const Incorreta = TemplateIncorreta.bind({});
Incorreta.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}

const TemplateAnulada = () => {
  return html`
    <ion-app>
      <ion-content style="--background: var(--med-color-neutral-dark-prime);">

        <!-- component -->
        <med-cartao-resposta-lista>

          <med-cartao-resposta-item color="warning-medium" anulada>01</med-cartao-resposta-item>

        </med-cartao-resposta-lista>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const Anulada = TemplateAnulada.bind({});
Anulada.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}

const TemplateImpressa = () => {
  return html`
    <ion-app>
      <ion-content style="--background: var(--med-color-neutral-dark-prime);">

        <!-- component -->
        <med-cartao-resposta-lista>

          <med-cartao-resposta-item impressa>01</med-cartao-resposta-item>

        </med-cartao-resposta-lista>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
}

export const Impressa = TemplateImpressa.bind({});
Impressa.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=802%3A477',
  },
}
