import { append, assoc, compose, pathOr } from 'ramda';

const reduceByIsNewProperty = <T, V extends keyof T>(
  array: T[],
  property: V,
): { new: T[]; old: T[] } => {
  const obj = array.reduce(
    (acc, item) => {
      const path = item[property] === true ? 'new' : 'old';

      const items = compose(append(item), pathOr([], [path]))(acc);

      return assoc(path, items, acc);
    },
    { new: [], old: [] },
  );

  return obj;
};

export default reduceByIsNewProperty;
