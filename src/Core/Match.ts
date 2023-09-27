export function match<TCase, TResult>(
    condition: TCase,
    ...cases: [...[TCase, TResult][], TResult]
): TResult {
    const specificCases = cases.slice(0, cases.length - 1) as [TCase, TResult][];
    const defaultCase = cases.at(-1) as TResult;

    return new Map(specificCases).get(condition) ?? defaultCase;
}