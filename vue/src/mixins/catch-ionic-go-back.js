export default {
  methods: {
    // Catch the bubbled-up event from the Ionic's back button
    catchIonicGoBack(event) {
      // We only care for the event coming from Ionic's back button
      const backButton = event.target && event.target.closest('ion-back-button')
      if (!backButton) return

      let defaultHref

      // Explicitly override router direction
      // This will always trigger a back transition
      this.$router.directionOverride = -1

      // If we can go back - do so
      // otherwise if there's a default fall-back - use it
      // else - skip
      if (this.$router.canGoBack()) {
        event.preventDefault()
        this.$router.back()
      } else if (undefined !== (defaultHref = backButton.defaultHref)) {
        event.preventDefault()
        this.$router.push(defaultHref)
      }
    },
  },
}
