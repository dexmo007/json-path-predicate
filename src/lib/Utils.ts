export function parseSingleton<T>(o: Object): [string, T] {
  return Object.entries(o)[0];
}
