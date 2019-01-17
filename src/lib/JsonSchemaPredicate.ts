import { JsonPathPredicate, JsonPathPredicates } from '@/lib/JsonPathPredicates';
import jp from 'jsonpath';
import { parseSingleton } from '@/lib/Utils';
import { Validator } from 'jsonschema';

@JsonPathPredicates.register('$jsonSchema',
  arg => new JsonSchemaPredicate(...parseSingleton(arg)),
  'Tests that the given JSON path is an array of the given size',
  '{"$size":{"$.foo": 2}}')
class JsonSchemaPredicate implements JsonPathPredicate {

  constructor(private readonly path: string,
              private readonly jsonSchema: Object) {
    jp.parse(path);
    new Validator().validate({}, jsonSchema);
  }

  test(o: Object): boolean {
    const matches = jp.query(o, this.path);
    const validator = new Validator();
    return matches.every(match => validator.validate(match, this.jsonSchema).valid);
  }

  stringify(): string {
    return `${this.path}.hasSchema(${JSON.stringify(this.jsonSchema)})`
  }
}
