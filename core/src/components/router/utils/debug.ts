import { generatePath } from './path';
import { RouteChain } from './interfaces';

export function printRoutes(routes: RouteChain[]) {
  console.debug('%c[@ionic/core]', 'font-weight: bold', `ion-router registered ${routes.length} routes`);
  for (const chain of routes) {
    const path: string[] = [];
    chain.forEach(r => path.push(...r.path));
    const ids = chain.map(r => r.id);
    console.debug(`%c ${generatePath(path)}`, 'font-weight: bold; padding-left: 20px', '=>\t', `(${ids.join(', ')})`);
  }
}
