export function createNotImplementedError(name: string) {
  throw new Error(`${name} is not implemented yet!`);
}

export function notImplemented(name: string) {
  const fn = (): any => {
    throw createNotImplementedError(name);
  };
  return Object.assign(fn, { __unenv__: true });
}
