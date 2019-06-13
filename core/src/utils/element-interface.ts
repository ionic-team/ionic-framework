// import { RouterDirection } from '../interface';

// TODO router direction
// The interfaces in this file are used to make sure our components
// have the correct properties defined that are needed to pass to
// the native HTML elements they render

export interface AnchorInterface {
  href: string | undefined;
  target: string | undefined;
  rel: string | undefined;
  download: string | undefined;
  // routerDirection: RouterDirection;
}

export interface ButtonInterface {
  type: 'submit' | 'reset' | 'button';
  disabled: boolean;
  // routerDirection: RouterDirection;
}
