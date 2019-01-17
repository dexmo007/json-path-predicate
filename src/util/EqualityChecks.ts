import deepEqual from 'deep-equal';


export function arrayContainsByDeepEquality(array: any[], e: any) {
  return array.some(ae => deepEqual(ae, e));
}
