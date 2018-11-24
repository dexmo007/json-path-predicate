import ExistsPredicate from './ExistsPredicate';
import EqualsPredicate from './EqualsPredicate';
import {negate, Predicate} from "@/lib/Predicate";
import AndPredicate from "@/lib/AndPredicate";

export default class JsonPathPredicate {

  static parse(expr: string): Predicate {
    try {
      const exprObj = JSON.parse(expr);
      return this._parse(exprObj);
    } catch (e) {
      return this._parse(expr);
    }
  }

  private static _parse(expr: (string | Object)) {

    if (typeof expr === 'string') {
      return new ExistsPredicate(expr);
    }
    if (typeof expr === 'object') {
      return this.parseObject(expr);
    }
    throw new Error(`invalid type for expression: ${typeof expr}`);
  }

  static parseObject(expr: any): Predicate {
    const keys = Object.keys(expr);
    if (keys.length > 1 || keys.length === 0) {
      throw new Error(`only a single key on root level of predicate allowed: ${keys.join()} for ${JSON.stringify(expr)}`);
    }
    const op = keys[0];
    switch (op) {
      case '$eq':
        return new EqualsPredicate(expr.$eq);
      case '$ne':
        return negate(new EqualsPredicate(expr.$ne));
      case '$and':
        return new AndPredicate(this.parseArray(expr.$and));
      default:
        throw new Error(`invalid op: ${op}`);
    }
  }

  static parseArray(predicates: any[]): Predicate[] {
    return predicates.map(this._parse);
  }
}
