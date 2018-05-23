const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const stencilPath = path.join(__dirname, '..', '..', 'core', 'node_modules', '.bin');


function buildIonicAngular() {
  const cmd = 'stencil';
  const args = [
    'build',
    '--config',
    path.join(__dirname, '..', 'stencil.config.js'),
    ...process.argv.slice(2)
  ];

  console.log(cmd, args.join(' '));

  const p = spawn('./stencil', args, { cwd: stencilPath, stdio: 'inherit' });
  p.on('close', (code) => {
    if (code > 0) {
      console.log(`@ionic/angular build exited with ${code}`);
    }
  });
}

function buildIonicCore() {
  const cmd = 'stencil';
  const args = [
    'build',
    '--config',
    path.join(__dirname, '..', '..', 'core', 'stencil.config.js'),
    ...process.argv.slice(2)
  ];

  console.log(cmd, args.join(' '));

  const p = spawn('./stencil', args, { cwd: stencilPath, stdio: 'inherit' });
  p.on('close', (code) => {
    if (code > 0) {
      console.log(`@ionic/core build exited with ${code}`);
    } else {
      copyIonicCore();
      copyIonicons();
    }
  });
}

function copyIonicons() {
  const src = path.join(__dirname, '..', '..', 'core', 'node_modules', 'ionicons');
  const dst = path.join(__dirname, '..', 'node_modules', 'ionicons');

  fs.emptyDirSync(dst);
  fs.copySync(src, dst);
}

function copyIonicCore() {
  const srcDir = path.join(__dirname, '..', '..', 'core');
  const dstDir = path.join(__dirname, '..', 'node_modules', '@ionic', 'core');

  fs.emptyDirSync(dstDir);

  const srcPkg = path.join(srcDir, 'package.json');
  const dstPkg = path.join(dstDir, 'package.json');
  fs.copySync(srcPkg, dstPkg);

  const srcDist = path.join(srcDir, 'dist');
  const dstDist = path.join(dstDir, 'dist');
  fs.emptyDirSync(dstDist);
  fs.copySync(srcDist, dstDist);
}

buildIonicCore();
buildIonicAngular();
