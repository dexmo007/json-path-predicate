export interface JsonPathPredicate {
  test(o: Object): boolean;
}

export function negate(predicate: JsonPathPredicate) {
  return new class implements JsonPathPredicate {
    test(o: Object): boolean {
      return !predicate.test(o);
    }
  };
}
