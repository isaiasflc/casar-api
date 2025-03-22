export const isObject = (data: object | string | undefined): boolean => {
  return Boolean(typeof data === 'object' && data !== null && !Array.isArray(data));
};

export const isEmptyObject = (data: object): boolean => {
  return !(isObject(data) && Object.keys(data).length > 0);
};

export const getObjectClassName = (data: object, defaultName?: string): string | undefined => {
  return isObject(data) ? data?.constructor?.name : defaultName;
};
