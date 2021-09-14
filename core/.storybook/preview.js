// ionic
import { defineCustomElements} from '../loader/index.js';
import '../css/core.css';
import '../css/display.css';
import '../css/flex-utils.css';
import '../css/float-elements.css';
import '../css/global.bundle.css';
import '../css/ionic.bundle.css';
import '../css/normalize.css';
import '../css/padding.css';
import '../css/structure.css';
import '../css/text-alignment.css';
import '../css/text-transformation.css';
import '../css/typography.css';
defineCustomElements();

// templarios
import '../css/default.css';
import '../css/complementares.css';
import '../css/espacamento.css';
import '../css/tipografia.css';

// templarios schemes
import '../css/dark.css';
import '../css/light.css';

// templarios themes
import '../css/medsoft.css';
import '../css/gold.css';
import '../css/recursos.css';

// storybook canvas
import './themes/templarios.css';
import '../src/stories/assets/fsemeric.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: { disable: true },
  themes: {
    target: 'root',
    onChange: (themeName) => {
      const snipet = document.querySelector('iframe').contentWindow.document.querySelector('.snipet__value--class');
      if(snipet) {
        document.querySelector('iframe').contentWindow.document.querySelector('.snipet__value--class').textContent = `${themeName.class.join(' ')}`;
      }

    },
    list: [
      {
        name: 'Theme Medsoft',
        class: ['theme-medsoft', 'scheme-dark'],
        color: '#3aa8b9',
        default: true
      },
      {
        name: 'Theme Medsoft / Scheme Light',
        class: ['theme-medsoft', 'scheme-light'],
        color: '#3aa8b9'
      },

      {
        name: 'Theme Gold',
        class: ['theme-gold', 'scheme-dark'],
        color: '#b89d58'
      },
      {
        name: 'Theme Gold / Scheme Light',
        class: ['theme-Gold', 'scheme-light'],
        color: '#b89d58'
      },

      {
        name: 'Theme Medsoft Gold',
        class: ['theme-medsoft', 'theme-gold', 'scheme-dark'],
        color: '#b89d58'
      },
      {
        name: 'Theme Medsoft Gold / Scheme Light',
        class: ['theme-medsoft', 'theme-gold', 'scheme-light'],
        color: '#b89d58'
      },

      {
        name: 'Theme Recursos',
        class: ['theme-recursos', 'scheme-dark'],
        color: '#68a6ba'
      },
      {
        name: 'Theme Recursos / Scheme Light',
        class: ['theme-recursos', 'scheme-light'],
        color: '#68a6ba'
      },
    ],
  },
  viewport: {
    viewports: {
      xxs: {
        name: 'xxs',
        styles: {
          width: '340px',
          height: '100%'
        },
      },
      xs: {
        name: 'xs',
        styles: {
          width: '380px',
          height: '100%'
        },
      },
      sm: {
        name: 'sm',
        styles: {
          width: '576px',
          height: '100%'
        },
      },
      md: {
        name: 'md',
        styles: {
          width: '768px',
          height: '100%'
        },
      },
      lg: {
        name: 'lg',
        styles: {
          width: '992px',
          height: '100%'
        },
      },
      xl: {
        name: 'xl',
        styles: {
          width: '1200px',
          height: '100%'
        },
      },
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: [
        'General', ['Welcome', 'Biblioteca', 'Arquitetura', 'Styleguide'],
        'Conhecimento', ['Metodologia BEM'],
        'Components',
        'Enums',
        'Tokens', ['Tokens', 'Cores', 'Tipografia', 'Espacamento', 'Complementares', 'Exemplo'],
        'Sass', ['Variables', 'Functions', 'Mixins'],
        'Ionic 1',
      ],
    },
  },
}
