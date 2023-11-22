export interface IDivision<TOther, TResult> {
    divide(other: TOther): TResult;
}

export function isDivision(value: any): value is IDivision<any, any> {
    return typeof value.divide === 'function';
};
