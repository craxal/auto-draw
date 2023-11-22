
export interface IEquality<TOther, TResult> {
    equal(other: TOther): TResult;
    notEqual(other: TOther): TResult;
}

export function isEquality(value: any): value is IEquality<any, any> {
    return typeof value.equal === 'function' && typeof value.notEqual === 'function';
}
