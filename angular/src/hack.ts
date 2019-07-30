
console.log('hack');
if (typeof (window as any) !== 'undefined') {
  const glb: any = (typeof (global as any) !== 'undefined' ? global : {});
  glb.window = {};

  if (typeof (document as any) !== 'undefined') {
    glb.document = {
      documentElement: {}
    };
  }
}
