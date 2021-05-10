import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Team/Alternativas',
  decorators: [withDesign],
};

const TemplateDefault = ({ alternativas }) => {
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

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=313%3A107',
  },
  actions: {
    handles: ['medChange'],
  },
}

Default.argTypes = {
  alternativas: {
    defaultValue: {
      alternativas: [
        {
          Alternativa: 'A',
          Enunciado: 'Enunciado A Lorem ipsum dolor sit amet consectetur adipisicing elit.<br/>Dolores quae repellendus quidem nam. Enunciado A Lorem ipsum dolor sit amet consectetur adipisicing elit.<br/>Dolores quae repellendus quidem nam.',
          Imagem: null,
          Porcentagem: 100
        },
        {
          Alternativa: 'B',
          Enunciado: 'Enunciado B Lorem ipsum dolor sit amet consectetur adipisicing elit.<br/>Dolores quae repellendus quidem nam.',
          Imagem: null,
          Porcentagem: 55
        },
        {
          Alternativa: 'C',
          Enunciado: 'Enunciado C Lorem ipsum dolor sit amet consectetur adipisicing elit.<br/>Dolores quae repellendus quidem nam.',
          Imagem: null,
          Porcentagem: 30
        },
        {
          Alternativa: 'D',
          Enunciado: 'Enunciado D Lorem ipsum dolor sit amet consectetur adipisicing elit.<br/>Dolores quae repellendus quidem nam.',
          Imagem: null,
          Porcentagem: 5
        },
        {
          Alternativa: 'D',
          Enunciado: 'Enunciado D Lorem ipsum dolor sit amet consectetur adipisicing elit.<br/>Dolores quae repellendus quidem nam.',
          Imagem: null,
          Porcentagem: 5
        },
      ],
      respostaCorreta: 'B',
      mostraResposta: true
    },
    control: { type: 'array' },
    description: 'Define a listagem de alternativas do **MedAlternativasInterface**'
  },
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

export const Imagens = TemplateImagens.bind({});
Imagens.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=392%3A160',
  },
  actions: {
    handles: ['medChange', 'medGalleryRequest'],
  },
}

Imagens.argTypes = {
  alternativas: {
    defaultValue: {
      alternativas: [
        {
          Alternativa: 'A',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 100
        },
        {
          Alternativa: 'B',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 55
        },
        {
          Alternativa: 'C',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 30
        },
        {
          Alternativa: 'D',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 5
        },
        {
          Alternativa: 'E',
          Enunciado: null,
          Imagem: 'https://via.placeholder.com/500',
          Porcentagem: 5
        },
      ],
      respostaCorreta: 'B',
      mostraResposta: true
    },
    control: { type: 'array' },
    description: 'Define a listagem de alternativas do **MedAlternativasInterface**'
  },
};
