import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MazaiData } from "../models/Mazai.data";
import { MazaiRepository } from "../repositories/Mazai.repository";

@Injectable({
    providedIn: 'root'
})
export class MazaiService {

    private _mazaiList: MazaiData[];
    readonly MazaiListObserver$: Observable<MazaiData[]>;
    private readonly _mazaiListSubject$: BehaviorSubject<MazaiData[]>;

    //テンプレートリスト
    private _templateList: MazaiData[];
    readonly TemplateObserver$: Observable<MazaiData[]>;
    private readonly _templateListSubject$: BehaviorSubject<MazaiData[]>;

    constructor(private repository: MazaiRepository) {
        this._mazaiList = [];
        this._mazaiListSubject$ = new BehaviorSubject<MazaiData[]>([]);
        this.MazaiListObserver$ = this._mazaiListSubject$.asObservable();

        this._templateList = [];
        this._templateListSubject$ = new BehaviorSubject<MazaiData[]>([]);
        this.TemplateObserver$ = this._templateListSubject$.asObservable();
    }

    /**
     * 魔剤リストを取得する
     */
    public async fetchMazaiList(): Promise<void> {
        this._mazaiList = await this.repository.fetchMazaiList();
        this.nextMazaiList();
    }

    /**
     * 魔剤を登録する
     * @param mazai 
     */
    public async registryMazai(mazai: MazaiData): Promise<void> {
        mazai.MazaiId = this.repository.generateUUID();
        await this.repository.registryMazai(mazai);
    }

    /**
     * 魔剤を削除する
     * @param mazai 
     */
    public async deleteMazai(mazai: MazaiData): Promise<void> {
        await this.repository.deleteMazai(mazai);
    }

    /**
     * 魔剤を更新する
     * 魔剤注入履歴は変更しない
     * @param mazai 
     */
    public async updateMazai(mazai: MazaiData): Promise<void> {
        await this.repository.updateMazai(mazai);
    }

    private nextMazaiList() {
        this._mazaiListSubject$.next(this._mazaiList);
    }

    /**
     * テンプレートリストを取得する
     */
    public async fetchTemplateList(): Promise<void> {
        this._templateList = await this.repository.fetchTemplateMazaiList();
        this._templateListSubject$.next(this._templateList);
    }

}