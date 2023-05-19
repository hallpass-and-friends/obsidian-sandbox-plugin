
export interface IKeyValuePair {
    [key: string]: string
}

export interface IKeyValuePairFilter {
    pattern: string;
    inclKey?: boolean;
    inclValue?: boolean;
}