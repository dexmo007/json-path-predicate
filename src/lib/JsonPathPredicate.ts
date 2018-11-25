export interface JsonPathPredicate {
  test(o: Object): boolean;

  stringify(): string;
}

export function negate(predicate: JsonPathPredicate) {
  return new class implements JsonPathPredicate {
    stringify(): string {
      return `!(${predicate.stringify()})`;
    }
    test(o: Object): boolean {
      return !predicate.test(o);
    }
  };
}
