import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import JsonPathPredicateParser from '@/lib/JsonPathPredicateParser';

@JsonPathPredicates.register('$not', arg => new NotPredicate(JsonPathPredicateParser.parse(arg)))
class NotPredicate implements JsonPathPredicate {
  constructor(private readonly predicate: JsonPathPredicate) {
  }

  stringify(): string {
    return `!(${this.predicate.stringify()})`;
  }

  test(o: Object): boolean {
    return !this.predicate.test(o);
  }
}
