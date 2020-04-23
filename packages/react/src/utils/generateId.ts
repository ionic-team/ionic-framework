
const ids: { [key: string]: number; } = { main: 1 };

export const generateId = (type = 'main') => {
  const id = (ids[type] ?? 1) + 1;
  ids[type] = id;
  return (id).toString();
};
