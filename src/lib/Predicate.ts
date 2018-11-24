export interface Predicate {
  test(o: Object): boolean;
}

export function negate(predicate: Predicate) {
  return new class implements Predicate {
    test(o: Object): boolean {
      return !predicate.test(o);
    }
  };
}
