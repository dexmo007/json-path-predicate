import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import jp from 'jsonpath';
import { parseSingleton } from '@/lib/Utils';

@JsonPathPredicates.register('$where',
  arg => new WherePredicate(...parseSingleton<string>(arg)),
  'Tests that the given JSON path is an array of the given size',
  '{"$size":{"$.foo": 2}}')
class WherePredicate implements JsonPathPredicate {

  private readonly fn: (a: any) => boolean = a => false;

  constructor(private readonly path: string,
              fn: string) {
    jp.parse(path);
    // this.fn = Function(`'use strict';return ${fn};`)();
    // this.fn = compiler.compileCode('return '+fn)();
  }

  test(o: Object): boolean {
    const matches = jp.query(o, this.path);
    return matches.every(match => this.fn(match));
  }

  stringify(): string {
    return `${this.path}.matches(${this.fn})`;
  }
}
