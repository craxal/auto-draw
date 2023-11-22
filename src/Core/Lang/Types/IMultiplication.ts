export interface IMultiplication<TOther, TResult> {
    multiply(other: TOther): TResult;
}

export function isMultiplication(value: any): value is IMultiplication<any, any> {
    return typeof value.multiply === 'function';
}
