import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';

import jp from 'jsonpath';
import deepEqual from 'deep-equal';
import { parseSingleton } from '@/lib/Utils';

@JsonPathPredicates.register('$ne', arg => new NotEqualsPredicate(...parseSingleton<string>(arg)))
class NotEqualsPredicate implements JsonPathPredicate {
  constructor(private readonly left: string,
              private readonly right: string) {
    jp.parse(left);
    jp.parse(right);
  }

  stringify(): string {
    return `${this.left} != ${this.right}`;
  }

  test(o: Object): boolean {
    return !deepEqual(jp.query(o, this.left), jp.query(o, this.right));
  }
}
