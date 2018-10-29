import Vue from 'vue';
import Router from '../router';
import Component from 'vue-class-component';

@Component
export default class CatchIonicGoBack extends Vue {
  // Catch the bubbled-up event from the Ionic's back button
  catchIonicGoBack(event: Event): void {
    if (!event.target) return;

    // We only care for the event coming from Ionic's back button
    const backButton = (event.target as HTMLElement).closest('ion-back-button') as HTMLIonBackButtonElement;
    if (!backButton) return;

    const $router = this.$router as Router;
    let defaultHref: string;

    // Explicitly override router direction to always trigger a back transition
    $router.directionOverride = -1;

    // If we can go back - do so
    if ($router.canGoBack()) {
      event.preventDefault();
      $router.back();
      return;
    }

    // If there's a default fallback - use it
    defaultHref = backButton.defaultHref as string;
    if (undefined !== defaultHref) {
      event.preventDefault();
      $router.push(defaultHref);
    }
  }
}
