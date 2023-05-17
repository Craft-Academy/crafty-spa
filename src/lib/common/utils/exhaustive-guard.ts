export const exhaustiveGuard = (value: never): never => {
  throw new Error(`Exhaustive Guard Error : received value ${value}`);
};
