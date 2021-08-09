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

// storybook canvas
import './themes/templarios.css';
import '../src/stories/assets/canvas.css';

// med-components fonts
import '../src/stories/assets/fsemeric.css';

// novo
import '../css/medsoft.css';
import '../css/medsoft-light.css';
import '../css/medgrupo.css';
import '../css/medgrupo-light.css';
import '../css/recursos.css';
import '../css/recursos-light.css';
import '../css/gold.css';
import '../css/gold-light.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  backgrounds: { disable: true },
  themes: [
    {
      name: 'Medgrupo - Dark Mode',
      class: ['color-scheme-dark', 'color-theme-medgrupo'],
      color: '#fc9d5a'
    },
    {
      name: 'Medgrupo - Light Mode',
      class: ['color-scheme-light', 'color-theme-medgrupo'],
      color: '#fc9d5a'
    },
    {
      name: 'Medsoft - Dark Mode',
      class: ['color-scheme-dark'],
      color: '#3aa8b9',
      default: true
    },
    {
      name: 'Medsoft - Light Mode',
      class: ['color-scheme-light'],
      color: '#3aa8b9',
    },
    {
      name: 'Recursos - Dark Mode',
      class: ['color-scheme-dark', 'color-theme-recursos'],
      color: '#68a6ba'
    },
    {
      name: 'Recursos - Light Mode',
      class: ['color-scheme-light', 'color-theme-recursos'],
      color: '#68a6ba'
    },
    {
      name: 'Gold - Dark Mode',
      class: ['color-scheme-dark', 'color-theme-gold'],
      color: '#b89d58'
    },
    {
      name: 'Gold - Light Mode',
      class: ['color-scheme-light', 'color-theme-gold'],
      color: '#b89d58'
    },
  ],
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
