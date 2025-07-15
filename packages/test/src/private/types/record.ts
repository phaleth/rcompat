import equals from "#equals";
import includes from "#includes";
import type Dict from "@rcompat/type/Dict";

const is_null = (x: unknown): x is null => x === null;

const is = (x: unknown): x is Dict =>
  typeof x === "object" && !is_null(x);

const partial = <t extends Dict>(x: t, y: t) =>
  Object.keys(x).reduce((equal, key) =>
    equal && equals(x[key], y[key]), true);

const equal = <T extends Dict>(x: T, y: T) =>
  Object.keys(x).length === Object.keys(y).length && partial(x, y);

const include = <T extends Dict>(x: T, y: T) =>
  Object.keys(x).length >= Object.keys(y).length &&
    Object.keys(y).reduce((included, key) =>
      included && includes(x[key], y[key]), true);

export default { equal, include, is, partial };
