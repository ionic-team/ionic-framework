var path = require('path');

var watch = require(path.join('..', '..', 'node_modules', '@ionic', 'app-scripts', 'dist', 'watch'));

var entryPointDirectory = path.dirname(process.env.IONIC_APP_ENTRY_POINT)

module.exports = {
  demoSrc: {
    paths: [path.join(entryPointDirectory, '..', '**', '*.(ts|html|s(c|a)ss)')],
    options: { ignored: [path.join(entryPointDirectory, '..', '**', '*.spec.ts'),
                  path.join(entryPointDirectory, '..', '**', '*.e2e.ts'),
                  path.join('**', '*.DS_Store')] },
    callback: watch.buildUpdate
  }
}
