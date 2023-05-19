import { IKeyValuePair, IKeyValuePairFilter } from "./kvp.models";

export class KeyValuePairRepo {
    private _store: IKeyValuePair = {};


    get(filter?: IKeyValuePairFilter) {
        //todo: implement the filter
        if (filter) {
            throw new Error('not implemented');
        }

        //immutable...
        return {
            ...this._store
        }
    }

    update(key: string, value: string) {
        this._store[key] = value;
    }
    
    remove(key: string) {
        if (typeof(this._store[key]) !== 'undefined') {
            delete this._store[key];
        }
    }

    clear() {
        this._store = {};
    }

    load(content: string) {
        try {
            content = this._preprocessParse(content);
            this._store = JSON.parse(content);
        } catch (error) {
            console.error("KeyValuePairRepo.load - failed", {content,error});
        }
    }

    toJson() {
        try {
            const json = JSON.stringify(this._store);
            return this._postprocessStringify(json);
        } catch (error) {
            console.error("KeyValuePairRepo.load - failed", {error});
            return '';
        }
    }


    private _postprocessStringify(json: string): string {
        //todo: encrypt the json
        return json;
    }

    private _preprocessParse(content: string): string {
        //todo: decrypt the content
        return content;
    }

}