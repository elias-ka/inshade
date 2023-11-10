import camelcaseKeys from 'camelcase-keys';

const camelize = <T extends readonly unknown[] | Record<string, unknown>>(val: T) =>
    camelcaseKeys(val);

export default camelize;
