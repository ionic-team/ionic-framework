import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import { MedColor } from '../../../constants';

export default {
  title: 'Components/Core/Tema',
  decorators: [withDesign],
};

let anteriorTheme = document
  .querySelector('html')
  .classList.contains('theme-gold')
  ? 'theme-gold'
  : null;

const changeTheme = {
  'theme-gold': () => {
    anteriorTheme = 'theme-gold';
    if (
      !document
        .querySelector('html')
        .classList.contains('theme-gold')
    ) {
      document
        .querySelector('html')
        .classList.add('theme-gold');
    }
  },
  'theme-default': () => {
    document.querySelector('html').classList.remove(anteriorTheme);
  }
};

const trocaTema = (ev) =>{
  console.log('troca tema')
  const fun = changeTheme[ev.detail];
  if (fun) {
    fun();
  }
}

const TemplateMedConig = () => {
  setTimeout(() => {
    document.querySelector('med-themes').temas = [{value:'theme-default',label:'Padrão'},{value:'theme-gold',label:'gold'}];
  }, 1000);

  return html`
    <div style="text-align: center;">

      <!-- component -->
      <med-themes @medChange="${trocaTema}" class="med-config__theme"></med-themes>
      <!-- component -->

    </div>
  `
}

export const SchemesThemes = TemplateMedConig.bind({});
SchemesThemes.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/zdbyAa3XpX3loOjJEaXc6E/Quest%C3%B5es?node-id=657%3A0',
  },
}
