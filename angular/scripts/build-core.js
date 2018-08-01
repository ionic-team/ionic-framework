const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const stencilPath = path.join(__dirname, '..', '..', 'core', 'node_modules', '.bin');


function buildIonicAngular() {
  return new Promise((resolve, reject) => {

    const cmd = 'stencil';
    const args = [
      'build',
      '--config',
      path.join(__dirname, '..', 'stencil.config.ts'),
      ...process.argv.slice(2)
    ];

    const p = spawn('./stencil', args, { cwd: stencilPath, stdio: 'inherit' });
    p.on('close', (code) => {
      if (code > 0) {
        console.log(`@ionic/angular build exited with ${code}`);
        reject();
      } else {
        resolve();
      }
    });
  });
}

function copyIonicons() {
  const src = path.join(__dirname, '..', '..', 'core', 'node_modules', 'ionicons');
  const dst = path.join(__dirname, '..', 'node_modules', 'ionicons');

  fs.removeSync(dst);
  fs.copySync(src, dst);
}

function copyCSS() {
  const src = path.join(__dirname, '..', '..', 'core', 'css');
  const dst = path.join(__dirname, '..', 'css');

  fs.removeSync(dst);
  fs.copySync(src, dst);
}

copyIonicons();
copyCSS();
buildIonicAngular();
