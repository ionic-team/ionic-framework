import { action } from "@storybook/addon-actions";
import { html } from "lit-html";
import { withDesign } from "storybook-addon-designs";
import { popoverController } from "../../../../../../dist/ionic/index.esm.js";
import { MedFontSize } from "../../../../constants";

export default {
  title: "Components/Core/Font Zoom",
  decorators: [withDesign],
};

let call = false;
let currentPopover = null;

const createPopover = async (ev, value) => {
  console.log("Create popoover", ev, value);
  popoverController
    .create({
      component: "med-font-zoom",
      cssClass: "med-popover",
      componentProps: {
        value,
        emitter: {
          emit: (values) => {
            action("emitter")(values);
          },
        },
      },
      mode: "ios",
      showBackdrop: true,
      event: ev,
    })
    .then((popover) => {
      currentPopover = popover;
      call = true;
      popover.present();
    });
};

const TemplateDefault = ({ value }) => {
  return html`
    <ion-app>
      <ion-content class="storybook-only__container">
        <!-- component -->
        <ion-button ds-name="primary" @click="${(e) => createPopover(e, value)}"
          >Abrir popover</ion-button
        >
        <!-- component -->
      </ion-content>
    </ion-app>
  `;
};

export const MedFontZoom = TemplateDefault.bind({});
MedFontZoom.parameters = {
  design: {
    type: "figma",
    url: "",
  },
};

MedFontZoom.argTypes = {
  value: {
    options: medFontSize,
    control: { type: "select" },
    description: "Define o tamanho da fonte.",
    defaultValue: "16px",
    table: {
      type: { summary: "MedFontSize Enum" },
      defaultValue: { summary: "MedFontSize.XS Enum" },
    },
  },
};
