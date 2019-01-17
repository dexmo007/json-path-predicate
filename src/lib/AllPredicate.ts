import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import jp from 'jsonpath';
import { parseSingleton } from '@/lib/Utils';
import { arrayContainsByDeepEquality } from '@/util/EqualityChecks';

@JsonPathPredicates.register('$all',
  arg => new AllPredicate(...parseSingleton<any[]>(arg)),
  'The predicate is true if all predicates in the array match',
  '{"$all":{"$.foo":["bar","doe"]}}')
class AllPredicate implements JsonPathPredicate {

  constructor(private readonly path: string,
              private readonly expectedElements: any[]) {
    jp.parse(path);
  }

  test(o: Object): boolean {
    const matches = jp.query(o, this.path);
    return matches.every(match => {
      if (!Array.isArray(match)) {
        return false;
      }
      return this.expectedElements.every(expectedElement => arrayContainsByDeepEquality(match, expectedElement));
    });
  }

  stringify(): string {
    return `${this.path}.containsAll(${this.expectedElements.map(ee => JSON.stringify(ee)).join(', ')})`
  }
}
