export interface IAddition<TOther, TResult> {
    add(other: TOther): TResult;
}

export function isAddition(value: any): value is IAddition<any, any> {
    return typeof value.add === 'function';
}
