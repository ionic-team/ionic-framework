import { create } from '@storybook/theming';
import templarios from './templarios-horizontal.svg';

export default create({
  base: 'dark',

  // main
  colorPrimary: '#fc9d5a',
  colorSecondary: '#fc9d5a',

  // ui
  appBg: '#20232a',
  appContentBg: '#282c34',
  appBorderColor: '#484d5b',
  appBorderRadius: 4,

  // typography
  fontBase:
    'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont,"Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontCode: 'monospace',

  // text
  textColor: '#fff',
  textInverseColor: 'red',
  textMutedColor: '#fc9d5a',

  // toolbar
  barTextColor: '#fff',
  barSelectedColor: '#fc9d5a',
  barBg: '#484d5b',

  // form
  inputBg: '#20232a',
  inputBorder: '#484d5b',
  inputTextColor: '#fff',
  inputBorderRadius: 4,

  // brand
  brandTitle: 'templarios',
  brandUrl: 'http://desenv.ordomederi.com/templarios/',
  brandImage: templarios,

  gridCellSize: '1',
});
