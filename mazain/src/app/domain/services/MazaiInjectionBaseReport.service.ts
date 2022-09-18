import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiData } from "../models/Mazai.data";
import { MazaiInjectionRecordData } from "../models/MazaiInjectionRecord.data";
import { MazaiInjectionBaseReportRepository } from "../repositories/MazaiInjectionBaseReport.repository";

@Injectable({
    providedIn: 'root'
})
export abstract class MazaiInjectionBaseReportService {

    abstract get WorkDate(): Date;

    abstract set WorkDate(val: Date);

    /** 摂取した魔剤のリスト */
    private _mazaiInjectionList: MazaiData[] = [];
    private readonly _mazaiInjectionListSubject$: BehaviorSubject<MazaiData[]> = new BehaviorSubject<MazaiData[]>([]);
    readonly MazaiInjectionListObserver: Observable<MazaiData[]> = this._mazaiInjectionListSubject$.asObservable();

    //接種した魔剤の本数
    private _mazaiInjectionCount: number = 0;
    private readonly _mazaiInjectionCountSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    readonly MazaiInjectionCountObserver: Observable<number> = this._mazaiInjectionCountSubject$.asObservable();

    //今日魔剤から摂取したエナジー
    private _energyReport: EnergyInjectionReportData = undefined;
    private readonly _energyReportSubject$: BehaviorSubject<EnergyInjectionReportData> = new BehaviorSubject<EnergyInjectionReportData>(undefined);
    readonly EnergyReportObserver: Observable<EnergyInjectionReportData> = this._energyReportSubject$.asObservable();

    //最後に注入した魔剤
    private _latestMazaiInjection: MazaiData = undefined;
    private readonly _latestMazaiInjectionSubject$: BehaviorSubject<MazaiData> = new BehaviorSubject<MazaiData>(undefined);
    readonly LatestMazaiInjectiondObserver: Observable<MazaiData> = this._latestMazaiInjectionSubject$.asObservable();

    constructor(private repository: MazaiInjectionBaseReportRepository) {
    }

    /**
     * 接種した魔剤のリストを取得
     */
    public async fetchMazaiInjectionList(): Promise<void> {
        this._mazaiInjectionList = await this.repository.getMazaiInjectionList(this.WorkDate);
        this._mazaiInjectionListSubject$.next(this._mazaiInjectionList);
    }

    /**
     * 今日接種した魔剤の本数を取得
     */
    public async fetchMazaiInjectionCount(): Promise<void> {
        this._mazaiInjectionCount = await this.repository.getMazaiInjectionCount(this.WorkDate);
        this._mazaiInjectionCountSubject$.next(this._mazaiInjectionCount);
    }

    /**
     * 今日魔剤から接種したエナジーを取得
     * @returns 
     */
    public async fetchEnergyReport(): Promise<void> {
        this._energyReport = await this.repository.getEnergyInjection(this.WorkDate);
        this._energyReportSubject$.next(this._energyReport);
    }

    /**
     * 魔剤注入
     * 自動で、今日の注入数、カフェイン数、糖質、カロリーを再取得する
     * @param mazai 
     */
    public async injectionMazai(mazai: MazaiData): Promise<void> {
        await this.repository.injectionMazai(this.WorkDate, mazai);

        await this.fetchMazaiInjectionCount();
        await this.fetchEnergyReport();
    }

    /**
     * 魔剤注入削除
     * 自動で、今日の注入数、エナジーレポートを再取得する
     */
    public async deleteInjectionMazai(mazai: MazaiData, record: MazaiInjectionRecordData): Promise<void> {
        await this.repository.deleteInjectionMazai(mazai, record);

        await this.fetchMazaiInjectionCount();
        await this.fetchEnergyReport();
    }

    /**
     * 最後に注入した魔剤のレコードを取得
     */
    public async fetchLatestMazaiInjection(): Promise<void> {
        this._latestMazaiInjection = await this.repository.getLatestMazaiInjection(this.WorkDate);
        this._latestMazaiInjectionSubject$.next(this._latestMazaiInjection);
    }

}