import { JsonPathPredicate } from './JsonPathPredicate';

const jp = require('jsonpath');


export default class EqualsPredicate implements JsonPathPredicate {
  private args: String[];

  constructor(args: String[]) {
    this.args = args;
  }

  test(o: Object): boolean {
    return this.args.map(arg => jp.query(o, arg))
      .map(results => results[0])
      .every((v, i, a) => v && v === a[0]);
  }
}
