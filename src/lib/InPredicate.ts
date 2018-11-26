import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';

import jp from 'jsonpath';
import deepEqual from 'deep-equal';
import ComparingPredicate from '@/lib/ComparingPredicate';

@JsonPathPredicates.register('$in', arg => new InPredicate(...ComparingPredicate.parse(arg)))
class InPredicate implements JsonPathPredicate {
  constructor(private readonly element: string,
              private readonly array: string) {
    jp.parse(element);
    jp.parse(array);
  }

  stringify(): string {
    return `${this.element} in ${this.array}`;
  }

  test(o: Object): boolean {
    const elements = jp.query(o, this.element);
    if (elements.length === 0) {
      return false;
    }
    const arrays = jp.query(o, this.array);
    if (arrays.length !== 1) {
      return false;
    }
    const array: any[] = arrays[0];
    if (!Array.isArray(array)) {
      return false;
    }
    return elements.every(e => array.some(ae => deepEqual(e, ae)));
  }
}
