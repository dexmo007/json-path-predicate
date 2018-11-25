import ExistsPredicate from './ExistsPredicate';
import EqualsPredicate from './EqualsPredicate';
import {negate, JsonPathPredicate} from "@/lib/JsonPathPredicate";
import AndPredicate from "@/lib/AndPredicate";
import OrPredicate from "@/lib/OrPredicate";

export default class JsonPathPredicateParser {

  static parse(expr: string): JsonPathPredicate {
    let exprObj: any;
    try {
      exprObj = JSON.parse(expr);
    } catch (e) {
      return JsonPathPredicateParser.parseInternal(expr);
    }
    return JsonPathPredicateParser.parseInternal(exprObj);
  }

  private static parseInternal(expr: (string | Object)) {

    if (typeof expr === 'string') {
      return new ExistsPredicate(expr);
    }
    if (typeof expr === 'object') {
      return JsonPathPredicateParser.parseObject(expr);
    }
    throw new Error(`invalid type for expression: ${typeof expr}`);
  }

  static parseObject(expr: any): JsonPathPredicate {
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
        return new AndPredicate(JsonPathPredicateParser.parseArray(expr.$and));
      case '$or':
        return new OrPredicate(JsonPathPredicateParser.parseArray(expr.$or));
      default:
        throw new Error(`invalid op: ${op}`);
    }
  }

  static parseArray(predicates: any[]): JsonPathPredicate[] {
    return predicates.map(JsonPathPredicateParser.parseInternal);
  }
}
