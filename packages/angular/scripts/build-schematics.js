const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

function buildSchematics(){
  return new Promise((resolve, reject) => {
    const args = [
      '--project',
      path.join(__dirname, '..', 'tsconfig.schematics.json'),
    ];

    const tsc = require.resolve('typescript/bin/tsc');
    const p = spawn(process.execPath, [tsc, ...args], { stdio: 'inherit' });
    p.on('close', (code) => {
      if (code > 0) {
        console.log(`schematics build exited with ${code}`);
        reject();
      } else {
        resolve();
      }
    });
  });
}

function copySchematicsJson(){
  const src = path.join(__dirname, '..', 'schematics', 'collection.json');
  const fileSrc = path.join(__dirname, '..', 'schematics', 'add', 'files');
  const dst = path.join(__dirname, '..', 'dist', 'schematics', 'collection.json');
  const fileDst = path.join(__dirname, '..', 'dist', 'schematics', 'add', 'files');
  const schemaSrc = path.join(__dirname, '..', 'schematics', 'add', 'schema.json');
  const schemaDst = path.join(__dirname, '..', 'dist', 'schematics', 'add', 'schema.json');

  fs.removeSync(dst);
  fs.removeSync(fileDst);
  fs.copySync(src, dst);
  fs.copySync(fileSrc,fileDst);
  fs.copySync(schemaSrc, schemaDst);

}

buildSchematics();
copySchematicsJson()
