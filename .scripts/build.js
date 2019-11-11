const common = require('./common');
const Listr = require('listr');


async function main() {
  const tasks = [];
  common.packages.forEach(package => {
    common.preparePackage(tasks, package, false, false);
  });

  const listr = new Listr(tasks, { showSubtasks: true });
  await listr.run();
}

main();