import ExistsPredicate from './ExistsPredicate';
import { JsonPathPredicate, JsonPathPredicates, PredicateDefinitions } from '@/lib/JsonPathPredicates';

import './AndPredicate';
import './EqualsPredicate';
import './GreaterThanOrEqualsPredicate';
import './GreaterThanPredicate';
import './InPredicate';
import './LessThanOrEqualsPredicate';
import './LessThanPredicate';
import './NotEqualsPredicate';
import './NotPredicate';
import './OrPredicate';
import './RegexPredicate';


export const operators: PredicateDefinitions = JsonPathPredicates.GetDefinitions();

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
    const def = operators[op];
    if (!def) {
      throw new Error(`invalid operator: ${op}`);
    }
    return def.creator(expr[op]);
  }

  static parseArray(predicates: any[]): JsonPathPredicate[] {
    return predicates.map(JsonPathPredicateParser.parseInternal);
  }
}
