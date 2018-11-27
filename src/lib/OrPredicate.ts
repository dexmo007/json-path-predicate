import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import JsonPathPredicateParser from '@/lib/JsonPathPredicateParser';
import NotPredicate from '@/lib/NotPredicate';

@JsonPathPredicates.register('$or', arg => new OrPredicate(JsonPathPredicateParser.parseArray(arg)))
@JsonPathPredicates.register('$nor', arg => new NotPredicate(new OrPredicate(JsonPathPredicateParser.parseArray(arg))))
class OrPredicate implements JsonPathPredicate {
  private readonly predicates: JsonPathPredicate[];

  constructor(predicates: JsonPathPredicate[]) {
    this.predicates = predicates;
  }

  test(o: Object): boolean {
    for (let i = 0; i < this.predicates.length; i += 1) {
      if (this.predicates[i].test(o)) {
        return true;
      }
    }
    return false;
  }

  stringify(): string {
    return `(${this.predicates.map(p => p.stringify()).join(' || ')})`;
  }
}
