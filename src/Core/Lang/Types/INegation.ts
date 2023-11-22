export interface INegation<TResult> {
    negate(): TResult;
}

export function isNegation(value: any): value is INegation<any> {
    return typeof value.negate === 'function';
}
