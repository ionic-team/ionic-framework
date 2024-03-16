const ids: { [key: string]: number } = { main: 1 };

export const generateId = (type: string = 'main') => {
  let id = (ids[type] ?? 1) + 1;
  ids[type] = id;
  return id.toString();
};
