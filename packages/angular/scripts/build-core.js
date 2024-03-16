const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const typescriptPath = path.join(__dirname, '..', 'node_modules', '.bin');

/**
 * Copy the CSS from the core package to the angular package.
 * 
 * This allows developers to import the global stylesheets
 * from the @ionic/angular package instead of @ionic/core. 
 */
function copyCSS() {
  const src = path.join(__dirname, '..', '..', '..', 'core', 'css');
  const dst = path.join(__dirname, '..','dist', 'css');

  fs.removeSync(dst);
  fs.copySync(src, dst);
}

function buildSchematics(){
  return new Promise((resolve, reject) => {
    const cmd = 'tsc';
    const args = [
      '--project',
      path.join(__dirname, '..', 'tsconfig.schematics.json'),
    ];

    const p = spawn(cmd, args, { cwd: typescriptPath, stdio: 'inherit', shell: true });
    p.on('close', (code) => {
      if (code > 0) {
        console.log(`ng-add build exited with ${code}`);
        reject();
      } else {
        resolve();
      }
    });
  });
}

function copySchematicsJson(){
  const src = path.join(__dirname, '..', 'src', 'schematics', 'collection.json');
  const fileSrc = path.join(__dirname, '..', 'src', 'schematics', 'add', 'files');
  const dst = path.join(__dirname, '..', 'dist','schematics', 'collection.json');
  const fileDst = path.join(__dirname, '..', 'dist', 'schematics', 'add', 'files');
  const schemaSrc = path.join(__dirname, '..', 'src', 'schematics', 'add', 'schema.json');
  const schemaDst = path.join(__dirname, '..', 'dist', 'schematics', 'add', 'schema.json');

  fs.removeSync(dst);
  fs.removeSync(fileDst);
  fs.copySync(src, dst);
  fs.copySync(fileSrc,fileDst);
  fs.copySync(schemaSrc, schemaDst);

}

copyCSS();
buildSchematics();
copySchematicsJson()
