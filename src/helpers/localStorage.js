const getItem = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

const clearStorage = () => {
  localStorage.clear();
};

export {
  getItem, setItem, removeItem, clearStorage,
};
