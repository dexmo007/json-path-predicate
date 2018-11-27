import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import JsonPathPredicateParser from '@/lib/JsonPathPredicateParser';

@JsonPathPredicates.register('$and',
    arg => new AndPredicate(JsonPathPredicateParser.parseArray(arg)),
  'The predicate is true if all predicates in the array match',
  '{"$and":[<pred1>, <pred2>, ...]}')
class AndPredicate implements JsonPathPredicate {
  private readonly predicates: JsonPathPredicate[];

  constructor(predicates: JsonPathPredicate[]) {
    this.predicates = predicates;
  }

  test(o: Object): boolean {
    for (let i = 0; i < this.predicates.length; i += 1) {
      if (!this.predicates[i].test(o)) {
        return false;
      }
    }
    return true;
  }

  stringify(): string {
    return this.predicates.map(p => p.stringify()).join(' && ');
  }
}
