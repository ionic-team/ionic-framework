export const generateUniqueId = () => {
  const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charArray: string[] = [];
  for(let i = 0; i < 10; i++) {
    charArray.push(charPool[Math.floor(Math.random() * charPool.length)]);
  }
  return charArray.join('');
};
