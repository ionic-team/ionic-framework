import { defineCustomElements} from '../loader/index.js';

defineCustomElements();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        'General', ['Welcome', 'Biblioteca', 'Arquitetura', 'Styleguide'],
        'Conhecimento', ['Metodologia BEM'],
        'Tokens', ['Tokens', 'Cores', 'Tipografia', 'Espacamento', 'Complementares', 'Exemplo'],
        'Global', ['Variables'],
        'Medsoft', ['Arquitetura', 'Variables', 'Mixins'],
        'External Pages',
        'Inscrições'],
    },
  },
}