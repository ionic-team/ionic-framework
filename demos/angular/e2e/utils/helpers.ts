
export function sleep(duration: number = 300) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}
