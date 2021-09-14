import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Questões/Alternativas',
  decorators: [withDesign],
};

const TemplateImagens = ({ alternativas }) => {
  const id = Math.random().toString(36).substr(2, 9);

  setTimeout(() => {
    const alternativasEl = document.getElementById(id);

    for(const key in alternativas) {
      alternativasEl[key] = alternativas[key];
    }
  }, 3000);

  return html`
    <ion-app class="storybook-only">
      <ion-content>

        <!-- component -->
          <med-alternativas id=${id}></med-alternativas>
        <!-- component -->

      </ion-content>
    </ion-app>
    `
  }

export const AlternativasImagens = TemplateImagens.bind({});
AlternativasImagens.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=392%3A160',
  },
  actions: {
    handles: ['medChange', 'medGalleryRequest'],
  },
}
AlternativasImagens.argTypes = {
  alternativas: {
    defaultValue: {
      alternativas: [
        {
          Alternativa: 'A',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 1
        },
        {
          Alternativa: 'B',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 0.55
        },
        {
          Alternativa: 'C',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 0.3
        },
        {
          Alternativa: 'D',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 0.05
        },
        {
          Alternativa: 'E',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 0
        },
      ],
      respostaCorreta: 'A',
      mostraResposta: true
    },
    control: { type: 'array' },
    description: 'Define a listagem de alternativas.',
    table: {
      type:  { summary: 'MedAlternativaInterface[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
