import type {
  LIFECYCLE_DID_ENTER,
  LIFECYCLE_DID_LEAVE,
  LIFECYCLE_WILL_ENTER,
  LIFECYCLE_WILL_LEAVE,
} from "@ionic/core/components";

// https://vuejs.org/guide/typescript/options-api.html#augmenting-custom-options
declare module "vue" {
  export interface ComponentCustomOptions {
    [LIFECYCLE_DID_ENTER]?: () => void;
    [LIFECYCLE_DID_LEAVE]?: () => void;
    [LIFECYCLE_WILL_ENTER]?: () => void;
    [LIFECYCLE_WILL_LEAVE]?: () => void;
  }
}
