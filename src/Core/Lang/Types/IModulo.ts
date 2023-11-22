export interface IModulo<TOther, TResult> {
    modulo(other: TOther): TResult;
}

export function isModulo(value: any): value is IModulo<any, any> {
    return typeof value.modulo === 'function';
}
