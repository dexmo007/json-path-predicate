import { JsonPathPredicate } from '@/lib/JsonPathPredicates';
import jp from 'jsonpath';

export default abstract class ComparingPredicate implements JsonPathPredicate {
  constructor(protected readonly left: string,
              protected readonly right: string) {
    jp.parse(left);
    jp.parse(right);
  }

  abstract stringify(): string;

  abstract testValues([l, r]: ([number, number] | [string, string])): boolean;

  test(o: Object): boolean {
    const lefts = jp.query(o, this.left);
    const rights = jp.query(o, this.right);
    if (lefts.length !== 1 || rights.length !== 1) {
      return false;
    }
    const left = lefts[0];
    const right = rights[0];
    if (typeof left === 'string' && typeof right === 'string') {
      return this.testValues([left, right]);
    } if (typeof left === 'number' && typeof right === 'number') {
      return this.testValues([left, right]);
    }
    return false;
  }

  static parse(arg: { [key: string]: string }): [string, string] {
    const [[left, right]] = Object.entries(arg);
    return [left, right];
  }
}
