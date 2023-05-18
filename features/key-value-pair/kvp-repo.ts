import { IKeyValuePair } from "./kvp.models";

export class KeyValuePairRepo {
    private _store: IKeyValuePair = {};


    reset() {
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