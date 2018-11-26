import { JsonPathPredicate } from '@/lib/JsonPathPredicates';

import jp from 'jsonpath';

export default class ExistsPredicate implements JsonPathPredicate {
  constructor(private readonly expr: string) {
    jp.parse(expr);
  }

  test(o: Object): boolean {
    return jp.query(o, this.expr).length > 0;
  }

  stringify(): string {
    return this.expr;
  }
}
