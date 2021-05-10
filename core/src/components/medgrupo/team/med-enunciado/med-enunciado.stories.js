import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Enunciado',
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

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: '',
  },
}
Default.argTypes = {
  enunciado: {
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae leo egestas, maximus elit eget, auctor dui. Nunc quis pulvinar magna, at dapibus est. Suspendisse volutpat euismod ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris malesuada semper purus non vehicula. Integer convallis sollicitudin.',
    control: { type: 'text' },
    description: 'Emento definido via slot.'
  },
};

const TemplateImagem = ({enunciado, imagens}) => {
  return html`
    <ion-app>
      <ion-content>

        <!-- component -->
        <med-enunciado imagens='${JSON.stringify(imagens)}'>
          ${enunciado}
        </med-enunciado>
        <!-- component -->

      <ion-content>
    </ion-app>
    `
  }

export const Imagem = TemplateImagem.bind({});
Imagem.parameters = {
  design: {
    type: 'figma',
    url: '',
  },
  actions: {
    handles: ['medGalleryRequest'],
  },
}
Imagem.argTypes = {
  enunciado: {
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae leo egestas, maximus elit eget, auctor dui. Nunc quis pulvinar magna, at dapibus est. Suspendisse volutpat euismod ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris malesuada semper purus non vehicula. Integer convallis sollicitudin.',
    control: { type: 'text' },
    description: 'Emento definido via slot.'
  },
  imagens: {
    defaultValue: ["https://via.placeholder.com/500", "https://via.placeholder.com/500", "https://via.placeholder.com/500"],
    control: { type: 'array' },
    description: 'Arrar de imagens do enunciado.'
  }
};
