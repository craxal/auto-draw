export interface IBitwise<TOther, TResult> {
    and(other: TOther): TResult;
    or(other: TOther): TResult;
    xor(other: TOther): TResult;
    not(): TResult;
}

export function isBitwise(value: any): value is IBitwise<any, any> {
    return typeof value.and === 'function'
        && typeof value.or === 'function'
        && typeof value.xor === 'function'
        && typeof value.not === 'function';
}
