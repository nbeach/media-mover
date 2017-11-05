import {isNull} from "lodash";

export function extractString(value: string, pattern: RegExp): string | null {
    const matches = value.match(pattern);
    return isNull(matches) ? null : matches[1];
}

export function extractNumber(value: string, pattern: RegExp): number | null {
    const extracted = extractString(value, pattern);
    return isNull(extracted) ? null : Number(extracted);
}

export function whenPresent<T, R>(value: T | null, operation: (val: T) => R): R | null {
    return isNull(value) ? null : operation(value);
}