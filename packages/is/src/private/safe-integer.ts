export default function isSafeInteger(x: unknown): x is number {
  if (typeof x === "number") return Number.isSafeInteger(x);

  return false;
}
