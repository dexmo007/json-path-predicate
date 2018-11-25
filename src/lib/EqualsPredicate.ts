import {JsonPathPredicate} from './JsonPathPredicate';

import deepEqual from 'deep-equal';


const jp = require('jsonpath');


export default class EqualsPredicate implements JsonPathPredicate {
  private readonly args: String[];

  constructor(args: String[]) {
    args.forEach(arg => jp.parse(arg));
    this.args = args;
  }

  test(o: Object): boolean {
    const firstResults = jp.query(o, this.args[0]);
    if (firstResults.length === 0 || firstResults.length > 1) {
      return false;
    }
    const first = firstResults[0];
    for (let i = 1; i < this.args.length; i++) {
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
