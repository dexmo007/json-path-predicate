export interface JsonPathPredicate {
  test(o: Object): boolean;

  stringify(): string;
}

class NegatedPredicate implements JsonPathPredicate {

  constructor(private readonly predicate: JsonPathPredicate) {
  }

  stringify(): string {
    return `!(${this.predicate.stringify()})`;
  }
  test(o: Object): boolean {
    return !this.predicate.test(o);
  }

}

export function negate(predicate: JsonPathPredicate) {
  return new NegatedPredicate(predicate);
}
