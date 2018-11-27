import deepEqual from 'deep-equal';
import jp from 'jsonpath';
import { JsonPathPredicate, JsonPathPredicates } from './JsonPathPredicates';

@JsonPathPredicates.register('$eq',
    arg => new EqualsPredicate(arg),
  'Tests all JSON paths in the array for (deep) equality',
  '{"$eq":[<path1>, <path2>, ...]}')
class EqualsPredicate implements JsonPathPredicate {
  constructor(private readonly args: string[]) {
    args.forEach(arg => jp.parse(arg));
  }

  test(o: Object): boolean {
    const firstResults = jp.query(o, this.args[0]);
    if (firstResults.length === 0 || firstResults.length > 1) {
      return false;
    }
    const first = firstResults[0];
    for (let i = 1; i < this.args.length; i += 1) {
      const results = jp.query(o, this.args[i]);
      if (results.length === 0) {
        return false;
      }
      if (results.length > 1) {
        return false;// todo or can we do anything else
      }
      if (!deepEqual(results[0], first)) {
        return false;
      }
    }
    return true;
  }

  stringify(): string {
    return this.args.join(' == ');
  }
}
