import {JsonPathPredicate} from "@/lib/JsonPathPredicate";

const jp = require('jsonpath');

export default class ExistsPredicate implements JsonPathPredicate {
  private readonly expr: string;

  constructor(expr: string) {
    jp.parse(expr);
    this.expr = expr;
  }

  test(o: Object): boolean {
    return jp.query(o, this.expr).length > 0;
  }

  stringify(): string {
    return this.expr;
  }

}
