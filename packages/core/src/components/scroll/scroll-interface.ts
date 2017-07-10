import { ScrollCallback } from '../../utils/interfaces';


export interface Scroll {
  enabled: boolean;
  jsScroll: boolean;

  ionScrollStart: ScrollCallback;
  ionScroll: ScrollCallback;
  ionScrollEnd: ScrollCallback;

  scrollToTop: (duration: number) => Promise<void>;
  scrollToBottom: (duration: number) => Promise<void>;
}
