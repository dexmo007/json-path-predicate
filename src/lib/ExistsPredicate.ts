import {Predicate} from "@/lib/Predicate";

const jp = require('jsonpath');

export default class ExistsPredicate implements Predicate {
  private readonly expr: string;

  constructor(expr: string) {
    jp.parse(expr);
    this.expr = expr;
  }

  test(o: Object): boolean {
    return jp.query(o, this.expr).length > 0;
  }

}
