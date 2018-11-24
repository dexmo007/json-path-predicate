import {JsonPathPredicate} from "@/lib/JsonPathPredicate";

export default class AndPredicate implements JsonPathPredicate {

  private readonly predicates: JsonPathPredicate[];

  constructor(predicates: JsonPathPredicate[]) {
    this.predicates = predicates;
  }

  test(o: Object): boolean {
    for (let i = 0; i < this.predicates.length; i++) {
      if (!this.predicates[i].test(o)) {
        return false;
      }
    }
    return true;
  }

};
