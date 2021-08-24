import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Components/Core/Message List',
  decorators: [withDesign],
};

const TemplateDefault = () => {
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
      color: var(--med-color-neutral-3);
      display: flex;
      align-items: center;
      transition: color 300ms ease-out;
      cursor: pointer;
    }

    .med-context-menu__item:last-child {
      margin-bottom: 0;
    }

    .med-context-menu__item:hover {
      color: var(--med-color-neutral-1);
    }

    .med-context-menu__icon {
      padding-right: var(--med-spacing-inline-xxxs);
      stroke: var(--med-color-neutral-3);
    }
  </style>

    <ion-app class="storybook-only">
      <ion-content class="storybook-only__container" style="text-align:left;">

        <!-- component -->

        <med-question texto="Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit"></med-question>

        <ion-grid>
          <ion-row>
            <ion-col>

            <med-message-list>

              <!-- MESSAGE -->

              <med-message nome="Alex" message-id="#31323132" concurso="UFRJ" texto="Lorem ispsum" ds-name="">

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
                    <ion-button ds-name="icon-only">
                      <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                      123
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

              <!-- MEDGRUPO -->

              <med-message nome="Alex" message-id="#413131" concurso="UFRJ" texto="Lorem ipsum" ds-name="medgrupo">

                <ul class="med-message__footer" slot="footer">
                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

              <!-- RESPONSE -->

              <med-message nome="Alex" message-id="#413131" concurso="UFRJ" texto="Lorem ipsum" ds-name="response">

                <med-avatar ds-size="xs" slot="avatar" letter="A"></med-avatar>

                <ul class="med-message__footer" slot="footer">
                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-only">
                      <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                      123
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

              <!-- COMMENT -->

              <med-message nome="Alex" message-id="#413131" concurso="UFRJ" texto="Lorem ipsum" ds-name="comment">

                <med-avatar ds-size="xs" slot="avatar" letter="A"></med-avatar>

                <ul class="med-message__footer" slot="footer">
                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-only">
                      <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                      123
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

              <!-- USER MESSAGE -->

              <med-message nome="Alex" message-id="#413131" concurso="UFRJ" texto="Lorem ipsum" ds-name="user-message">

               <med-avatar ds-size="xs" slot="avatar" letter="A"></med-avatar>

                <ul class="med-message__footer" slot="footer">
                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-only">
                      <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                      123
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

              <!-- COMMENT -->

              <med-message nome="Alex" message-id="#413131" concurso="UFRJ" texto="Lorem ipsum" ds-name="comment">

                <med-avatar ds-size="xs" slot="avatar" letter="A"></med-avatar>

                <ul class="med-message__footer" slot="footer">
                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-only">
                      <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                      123
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

              <!-- RESPONSE -->

              <med-message nome="Alex" message-id="#413131" concurso="UFRJ" texto="Lorem ipsum" ds-name="response">

                <med-avatar ds-size="xs" slot="avatar" letter="A"></med-avatar>

                <ul class="med-message__footer" slot="footer">
                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-only">
                      <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                      123
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

              <!-- MESSAGE -->

              <med-message nome="Alex" message-id="#31323132" concurso="UFRJ" texto="Lorem ispsum" ds-name="">

                <med-avatar ds-size="xs" slot="avatar" letter="A"></med-avatar>

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

                <ion-badge ds-size="xxs" ds-name="secondary">EM QUESTÃO X - 2021 INSTITUIÇÃO</ion-badge>

                <ul class="med-message__footer" slot="footer">
                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-only">
                      <ion-icon class="med-icon" slot="icon-only" name="med-estrela"></ion-icon>
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-positivo" slot="start"></ion-icon>
                      4221
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="icon-label">
                      <ion-icon class="med-icon" name="med-gabarito" slot="start"></ion-icon>
                      123
                    </ion-button>
                  </li>

                  <li class="med-message__list-item">
                    <ion-button ds-name="tertiary">RESPONDER</ion-button>
                  </li>
                </ul>

              </med-message>

            </med-message-list>

            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const messageList = TemplateDefault.bind({});
messageList.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=5308%3A42728',
  },
}
messageList.argTypes = {
};
