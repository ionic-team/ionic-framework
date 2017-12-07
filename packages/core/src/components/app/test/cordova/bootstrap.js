

export async function bootstrap() {
  const nav = document.querySelector('ion-nav');
  await nav.componentOnReady();
  const pageOneModule = await import('./page-one.js');

  const pageOne = new pageOneModule.PageOne(nav);

  nav.push(pageOne.getElement()).then(() => {
    pageOne.initialize();
  });
}

// IDK, it errors out sometimes if I bootstrap right away
setTimeout(() => {
  bootstrap()
}, 250);