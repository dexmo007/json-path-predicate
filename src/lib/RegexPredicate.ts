import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';

import jp from 'jsonpath';

@JsonPathPredicates.register('$regex', arg => RegexPredicate.parse(arg))
class RegexPredicate implements JsonPathPredicate {
  constructor(private readonly regex: RegExp,
              private readonly path: string) {
    jp.parse(path);
  }

  test(o: Object): boolean {
    return jp.query(o, this.path)
      .every(result => typeof result === 'string' && this.regex.test(result));
  }

  stringify(): string {
    return `${this.regex}.test(${this.path})`;
  }

  static parse(arg: { [key: string]: string }) {
    const [[path, regex]] = Object.entries(arg);
    return new RegexPredicate(new RegExp(regex), path);
  }
}
