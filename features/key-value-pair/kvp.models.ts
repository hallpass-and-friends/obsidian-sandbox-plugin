
export interface IKeyValuePair {
    [key: string]: string
}

export type SingleKeyValuePair = {
    key: string,
    value: string;
}

export interface IKeyValuePairFilter {
    pattern: string;
    inclKey?: boolean;
    inclValue?: boolean;
}