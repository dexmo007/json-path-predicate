import ComparingPredicate from '@/lib/ComparingPredicate';
import { JsonPathPredicates } from '@/lib/JsonPathPredicates';
import { parseSingleton } from '@/lib/Utils';

@JsonPathPredicates.register('$gte', arg => new GreaterThanOrEqualsPredicate(...parseSingleton<string>(arg)))
class GreaterThanOrEqualsPredicate extends ComparingPredicate {
  stringify(): string {
    return `${this.left} >= ${this.right}`;
  }

  testValues([l, r]: [number, number] | [string, string]): boolean {
    return l >= r;
  }
}
