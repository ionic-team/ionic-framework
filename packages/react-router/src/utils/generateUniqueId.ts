export const generateUniqueId = (length: number = 10) => {
  const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charArray: string[] = [];
  for(let i = 0; i < length; i++) {
    charArray.push(charPool[Math.floor(Math.random() * charPool.length)]);
  }
  return charArray.join('');
};
