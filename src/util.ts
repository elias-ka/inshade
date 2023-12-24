import camelcaseKeys from 'camelcase-keys';

export const camelize = <T extends readonly unknown[] | Record<string, unknown>>(val: T) => {
    return camelcaseKeys(val);
};

export const groupConsecutiveDuplicates = <T>(arr: readonly T[]): T[][] => {
    return arr.reduce((result: T[][], value: T, i: number) => {
        if (i !== 0 && value === arr[i - 1]) {
            result[result.length - 1].push(value);
        } else {
            result.push([value]);
        }
        return result;
    }, []);
};
