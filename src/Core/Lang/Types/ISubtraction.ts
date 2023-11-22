export interface ISubtraction<TOther, TResult> {
    subtract(other: TOther): TResult;
}

export function isSubtraction(value: any): value is ISubtraction<any, any> {
    return typeof value.subtract === 'function';
}
