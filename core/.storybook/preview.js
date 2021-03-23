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

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  backgrounds: { disable: true },
  themes: [
    {
      name: 'Dark Mode',
      class: ['dark'],
      color: '#000'
    },
    {
      name: 'Light Mode',
      class: ['light'],
      color: '#fff', 
      default: true 
    },
    {
      name: 'Gold - Dark Mode',
      class: ['dark', 'gold'],
      color: '#b89d58'
    },
    {
      name: 'Gold - Light Mode',
      class: ['light', 'gold'],
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
      order: [
        'General', ['Welcome', 'Biblioteca', 'Arquitetura', 'Styleguide'],
        'Conhecimento', ['Metodologia BEM'],
        'Sass', ['Variables', 'Functions', 'Mixins'],
        'Tokens', ['Tokens', 'Cores', 'Tipografia', 'Espacamento', 'Complementares', 'Exemplo'],
        'Components'
      ],
    },
  },
}