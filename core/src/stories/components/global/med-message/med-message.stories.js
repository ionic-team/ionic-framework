import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Message',
  decorators: [withDesign],
};

const TemplateDefault = ({ dsName, nome, concurso, texto, messageId }) => {
  return html`

  <style>
    .storybook-only {
      overflow: visible;
    }

    .med-message__footer {
      list-style: none;
      display: flex;
      padding: 0;
      margin: 0;
    }

    .med-message__list-item:not(:last-child) {
      margin-right: var(--med-spacing-inline-xxs);
    }

    .med-message__list-item:last-child {
      margin-left: auto;
    }

    .med-context-menu__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .med-context-menu__item {
      padding-right: var(--med-spacing-inline-xs);
      margin-bottom: var(--med-spacing-stack-base);
      font-size: var(--med-font-size-xs);
      line-height: var(--med-line-height-compressed);
      color: hsl(var(--med-color-neutral-3));
      display: flex;
      align-items: center;
      transition: color 300ms ease-out;
      cursor: pointer;
    }

    .med-context-menu__item:last-child {
      margin-bottom: 0;
    }

    .med-context-menu__item:hover {
      color: hsl(var(--med-color-neutral-1));
    }

    .med-context-menu__icon {
      padding-right: var(--med-spacing-inline-xxxs);
    }
  </style>

    <ion-app class="storybook-only">
      <div class="storybook-only__container" style="text-align:left; max-width: 1200px; padding: 0 15px;">

        <!-- component -->
          <med-message ds-name=${dsName} .nome=${nome} .concurso=${concurso} .texto=${texto} message-id=${messageId}>

            <med-context-menu slot="menu" class="med-context-menu">
              <ul class="med-context-menu__list">
                <li class="med-context-menu__item">
                  <ion-icon class="med-icon med-context-menu__icon" name="med-editar"></ion-icon>
                  <span>Editar</span>
                </li>
                <li class="med-context-menu__item">
                  <ion-icon class="med-icon med-context-menu__icon" name="med-lixeira"></ion-icon>
                  <span>Deletar</span>
                </li>
              </ul>
            </med-context-menu>

            <med-avatar ds-size="xs" slot="avatar" letter="A"></med-avatar>

            <ion-badge ds-size="xxs" ds-name="secondary">EM QUESTÃO X - 2021 INSTITUIÇÃO</ion-badge>

            <ul class="med-message__footer" slot="footer">
              <li class="med-message__list-item">
                <ion-button ds-name="tertiary">
                  <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                </ion-button>
              </li>

              <li class="med-message__list-item">
                <ion-button ds-name="tertiary">
                  <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                  4221
                </ion-button>
              </li>

              <li class="med-message__list-item">
                <ion-button ds-name="tertiary">
                  <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                  123
                </ion-button>
              </li>

              <li class="med-message__list-item">
                <ion-button ds-name="tertiary">RESPONDER</ion-button>
              </li>
            </ul>

          </med-message>
        <!-- component -->

      </div>
    </ion-app>
  `
}

export const message = TemplateDefault.bind({});
message.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=5308%3A42728',
  },
}
message.argTypes = {
  dsName: {
    options: [undefined, 'medgrupo', 'response', 'comment', 'user-message'],
    control: { type: 'inline-radio'},
    description: "Define a variação do componente.",
    table: {
      type:  { summary: 'medgrupo | response | comment | user-message'},
      defaultValue: { summary: 'undefined' },
    },
  },
  nome: {
    control: { type: 'text' },
    description: "Define o nome do aluno.",
    defaultValue: 'Nome',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  concurso: {
    control: { type: 'text' },
    description: "Define o nome do concurso.",
    defaultValue: 'UFRJ',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  texto: {
    control: { type: 'text' },
    description: "Define o conteúdo de texto.",
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi urna neque, elementum sed porta sit amet, auctor tincidunt ligula. Sed id congue odio.',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  messageId: {
    control: { type: 'text' },
    description: "Define a id da mensagem.",
    defaultValue: '#413131',
    table: {
      type:  { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
};
