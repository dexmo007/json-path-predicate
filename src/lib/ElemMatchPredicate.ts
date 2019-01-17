import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import jp from 'jsonpath';
import { parseSingleton } from '@/lib/Utils';
import JsonPathPredicateParser from '@/lib/JsonPathPredicateParser';

@JsonPathPredicates.register('$elemMatch',
  arg => new ElemMatchPredicate(...parseSingleton<any>(arg)),
  'Tests that the given JSON path is an array of the given size',
  '{"$size":{"$.foo": 2}}')
class ElemMatchPredicate implements JsonPathPredicate {
  private readonly predicate: JsonPathPredicate;

  constructor(private readonly path: string,
              predicate: any) {
    jp.parse(path);
    this.predicate = JsonPathPredicateParser.parse(predicate);
  }

  test(o: Object): boolean {
    const matches = jp.query(o, this.path);
    return matches.every(match => {
      if (!Array.isArray(match)) {
        return false;
      }
      return match.some(m => this.predicate.test(m));
    });
  }

  stringify(): string {
    return `${this.path}.anyMatches(${this.predicate.stringify()})`
  }
}
