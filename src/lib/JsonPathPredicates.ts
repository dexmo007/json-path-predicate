export interface JsonPathPredicate {
  test(o: Object): boolean;

  stringify(): string;
}

export type PredicateCreator = (arg: any) => JsonPathPredicate;
export type PredicateDefinitions = { [op: string]: PredicateCreator };

export namespace JsonPathPredicates {

  const definitions: PredicateDefinitions = {};

  export function GetDefinitions(): PredicateDefinitions {
    return definitions;
  }

  export function register(op: string, creator: (arg: any) => JsonPathPredicate): (target: any) => void {
    if (!op) {
      throw new Error('JsonPathPredicate operator must be non empty');
    }
    if (!creator) {
      throw new Error('JsonPathPredicate creator must be defined');
    }
    definitions[op] = creator;
    return () => {
    };
  }
}
