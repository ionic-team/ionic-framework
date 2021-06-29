const ids: { [key: string]: number } = { main: 0 };

export const generateId = (type = 'main') => {
  const id = (ids[type] ?? 0) + 1;
  ids[type] = id;
  return id.toString();
};
