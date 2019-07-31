
exports.applyPolyfills = function() { return Promise.resolve() };

exports.defineCustomElements = function(_, opts) {
  return new Promise(function(resolve, reject) {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      opts = opts || {};
      const doc = document;
      const mod = doc.createElement('script');
      mod.setAttribute('type', 'module');
      mod['data-opts'] = opts;
      mod.src = '__CDN_LOADER_URL__/dist/ionic/ionic.esm.js';

      const legacy = doc.createElement('script');
      legacy.setAttribute('nomodule', '');
      legacy['data-opts'] = opts;
      legacy.src = '__CDN_LOADER_URL__/dist/ionic/ionic.js';

      mod.onload = resolve;
      mod.onerror = reject;

      legacy.onload = resolve;
      legacy.onerror = reject;

      doc.head.appendChild(mod);
      doc.head.appendChild(legacy);
    } else {
      resolve();
    }
  });
}
