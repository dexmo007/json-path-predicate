import ComparingPredicate from '@/lib/ComparingPredicate';
import { JsonPathPredicates } from '@/lib/JsonPathPredicates';
import { parseSingleton } from '@/lib/Utils';

@JsonPathPredicates.register('$gt', arg => new GreaterThanPredicate(...parseSingleton<string>(arg)))
class GreaterThanPredicate extends ComparingPredicate {
  stringify(): string {
    return `${this.left} > ${this.right}`;
  }

  testValues([l, r]: [number, number] | [string, string]): boolean {
    return l > r;
  }
}
