{
  const getStyles = () => {
    const tag = document.createElement('style');
    tag.textContent = `
      :root {
        --ion-font-family: Arial;
      }
    `;
    return tag;
  };

  if (window.location.search.indexOf('ionic:_testing=true') > -1) {
    document.head.appendChild(getStyles());
  }
}
