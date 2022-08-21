import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage: Storage | null = null;

    get Storage(): Storage {
        return this._storage;
    }

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        if (this._storage !== null) { return; }
        const storage = await this.storage.create();
        this._storage = storage;
    }

    public async set(key: string, value: any): Promise<any> {
        return this._storage?.set(key, value);
    }

    public async get(key: string): Promise<string> {
        return this._storage.get(key);
    }

    public async remove(key: string): Promise<any> {
        return this._storage.remove(key);
    }

    public async keys(): Promise<string[]> {
        return this._storage.keys();
    }
}