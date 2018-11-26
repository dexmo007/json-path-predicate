import ComparingPredicate from '@/lib/ComparingPredicate';
import { JsonPathPredicates } from '@/lib/JsonPathPredicates';
import { parseSingleton } from '@/lib/Utils';

@JsonPathPredicates.register('$lt', arg => new LessThanPredicate(...parseSingleton<string>(arg)))
class LessThanPredicate extends ComparingPredicate {
  stringify(): string {
    return `${this.left} < ${this.right}`;
  }

  testValues([l, r]: [number, number] | [string, string]): boolean {
    return l < r;
  }
}
