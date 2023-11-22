export interface IComparison<TOther, TResult> {
    lessThan(other: TOther): TResult;
    lessThanOrEqual(other: TOther): TResult;
    greaterThan(other: TOther): TResult;
    greaterThanOrEqual(other: TOther): TResult;
}

export function isComparison(value: any): value is IComparison<any, any> {
    return typeof value.lessThan === 'function'
        && typeof value.lessThanOrEqual === 'function'
        && typeof value.greaterThan === 'function'
        && typeof value.greaterThanOrEqual === 'function';
}
