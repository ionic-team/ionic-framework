import { html } from 'lit-html';
import { withDesign } from 'storybook-addon-designs';
import {popoverController} from '../../../../dist/ionic/index.esm.js';

export default {
  title: 'Components/Global/Tooltip',
  decorators: [withDesign],
};

let call = false
let currentPopover = null;

//
// Simple
//

const createSimplePopover = async (ev) => {
  popoverController.create({
    component: 'med-tooltip',
    cssClass: 'med-tooltip',
    showBackdrop: false,
    componentProps: {
      content: 'Tooltip Simples',
    },
    mode: 'ios',
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

const TemplateSimple = () => {
  return html`
    <ion-app>
      <ion-content class="storybook-only__container">

        <!-- component -->
        <div style="display: flex; justify-content: center;">
          <ion-icon color="dark-30" name="med-information" @click="${createSimplePopover}" style="cursor: pointer;"></ion-icon>
        </div>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const Simple = TemplateSimple.bind({});
Simple.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}

//
// Default
//

const createDefaultPopover = async (ev) => {
  popoverController.create({
    component: 'med-tooltip',
    cssClass: 'med-tooltip',
    showBackdrop: false,
    componentProps: {
      content: 'Este é um exemplo de tootip em parágrafo. Esse box contém o tamanho máximo de texto que pode ser exibido. Acima disso, utilize um modal.',
    },
    mode: 'ios',
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

const TemplateDefault = () => {
  return html`
    <ion-app>
      <ion-content class="storybook-only__container">

        <!-- component -->
        <div style="display: flex; justify-content: center;">
          <ion-icon color="dark-30" name="med-information" @click="${createDefaultPopover}" style="cursor: pointer;"></ion-icon>
        </div>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const Default = TemplateDefault.bind({});
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}

//
// Header
//

const createHeaderPopover = async (ev) => {
  popoverController.create({
    component: 'med-tooltip',
    cssClass: 'med-tooltip',
    showBackdrop: false,
    componentProps: {
      header: 'Título do Tutorial',
      content: 'Este é um exemplo de tootip em parágrafo. Esse box contém o tamanho máximo de texto que pode ser exibido. Acima disso, utilize um modal.',
    },
    mode: 'ios',
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

const TemplateHeader = () => {
  return html`
    <ion-app>
      <ion-content class="storybook-only__container">

        <!-- component -->
        <div style="display: flex; justify-content: center;">
          <ion-icon color="dark-30" name="med-information" @click="${createHeaderPopover}" style="cursor: pointer;"></ion-icon>
        </div>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const Header = TemplateHeader.bind({});
Header.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}

//
// Button text
//

const createButtonTextPopover = async (ev) => {
  popoverController.create({
    component: 'med-tooltip',
    cssClass: 'med-tooltip',
    showBackdrop: false,
    componentProps: {
      header: 'Título do Tutorial',
      content: 'Este é um exemplo de tootip em parágrafo. Esse box contém o tamanho máximo de texto que pode ser exibido. Acima disso, utilize um modal.',
      buttonLeft: {
        label: 'Pular tutorial',
      },
      buttonRight: {
        label: 'Confirmar e encerrar',
      }
    },
    mode: 'ios',
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

const TemplateButtonText = () => {
  return html`
    <ion-app>
      <ion-content class="storybook-only__container">

        <!-- component -->
        <div style="display: flex; justify-content: center;">
          <ion-icon color="dark-30" name="med-information" @click="${createButtonTextPopover}" style="cursor: pointer;"></ion-icon>
        </div>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const ButtonText = TemplateButtonText.bind({});
ButtonText.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}

//
// Button icon
//

const createButtonIconPopover = async (ev) => {
  popoverController.create({
    component: 'med-tooltip',
    cssClass: 'med-tooltip',
    showBackdrop: false,
    componentProps: {
      header: 'Título do Tutorial',
      content: 'Este é um exemplo de tootip em parágrafo. Esse box contém o tamanho máximo de texto que pode ser exibido. Acima disso, utilize um modal.',
      buttonLeft: {
        label: 'Pular tutorial',
      },
      buttonRight: {
        label: 'Confirmar e encerrar',
        icon: 'med-arrow-right-circle'
      }
    },
    mode: 'ios',
    event: ev,
  }).then((popover)=>{
    currentPopover = popover
    call = true
    popover.present()
  });
}

const TemplateButtonIcon = () => {
  return html`
    <ion-app>
      <ion-content class="storybook-only__container">

        <!-- component -->
        <div style="display: flex; justify-content: center;">
          <ion-icon color="dark-30" name="med-information" @click="${createButtonIconPopover}" style="cursor: pointer;"></ion-icon>
        </div>
        <!-- component -->

      </ion-content>
    </ion-app>
  `
}

export const ButtonIcon = TemplateButtonIcon.bind({});
ButtonIcon.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/2j9jNt3PmQXpzD3IQJkyZe/Componentes?node-id=2103%3A170',
  },
}
