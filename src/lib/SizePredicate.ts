import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import jp from 'jsonpath';
import { parseSingleton } from '@/lib/Utils';

@JsonPathPredicates.register('$size',
  arg => new SizePredicate(...parseSingleton<number>(arg)),
  'Tests that the given JSON path is an array of the given size',
  '{"$size":{"$.foo": 2}}')
class SizePredicate implements JsonPathPredicate {

  constructor(private readonly path: string,
              private readonly expectedElements: number) {
    jp.parse(path);
    if (!Number.isInteger(expectedElements)) {
      throw new Error('expected number of elements must be an integer');
    }
  }

  test(o: Object): boolean {
    const matches = jp.query(o, this.path);
    return matches.every(match => {
      if (!Array.isArray(match)) {
        return false;
      }
      return match.length === this.expectedElements;
    });
  }

  stringify(): string {
    return `${this.path}.length == ${this.expectedElements}`
  }
}
