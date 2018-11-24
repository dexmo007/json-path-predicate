import {Predicate} from "@/lib/Predicate";

export default class AndPredicate implements Predicate {

  private readonly predicates: Predicate[];

  constructor(predicates: Predicate[]) {
    this.predicates = predicates;
  }

  test(o: Object): boolean {
    return this.predicates.map(p => p.test(o))
      .every(v => !!v === true);
  }

};
