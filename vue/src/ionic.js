import '@ionic/core/css/ionic.bundle.css'
import 'ionicons/dist/collection/icon/icon.css'
import '@ionic/core/dist/ionic/svg'
import { defineCustomElements } from '@ionic/core/dist/esm'

export default {
  init(opts = {}) {
    defineCustomElements(window, opts)
  },
}
