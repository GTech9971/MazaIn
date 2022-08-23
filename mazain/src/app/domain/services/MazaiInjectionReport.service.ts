import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiData } from "../models/Mazai.data";
import { MazaiInjectionRecordData } from "../models/MazaiInjectionRecord.data";
import { MazaiInjectionReportRepository } from "../repositories/MazaiInjectionReport.repository";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionReportService {
    /** 今日摂取した魔剤のリスト */
    private _todayMazaiInjectionList: MazaiData[] = [];
    private readonly _todayMazaiInjectionListSubject$: BehaviorSubject<MazaiData[]> = new BehaviorSubject<MazaiData[]>([]);
    readonly TodayMazaiInjectionListObserver: Observable<MazaiData[]> = this._todayMazaiInjectionListSubject$.asObservable();

    //今日接種した魔剤の本数
    private _todayMazaiInjectionCount: number = 0;
    private readonly _todayMazaiInjectionCountSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    readonly TodayMazaiInjectionCountObserver: Observable<number> = this._todayMazaiInjectionCountSubject$.asObservable();

    //今日魔剤から摂取したエナジー
    private _todayEnergyReport: EnergyInjectionReportData = undefined;
    private readonly _todayEnergyReportSubject$: BehaviorSubject<EnergyInjectionReportData> = new BehaviorSubject<EnergyInjectionReportData>(undefined);
    readonly TodayEnergyReportObserver: Observable<EnergyInjectionReportData> = this._todayEnergyReportSubject$.asObservable();

    //最後に注入した魔剤
    private _latestMazaiInjection: MazaiData = undefined;
    private readonly _latestMazaiInjectionSubject$: BehaviorSubject<MazaiData> = new BehaviorSubject<MazaiData>(undefined);
    readonly LatestMazaiInjectiondObserver: Observable<MazaiData> = this._latestMazaiInjectionSubject$.asObservable();

    constructor(private repository: MazaiInjectionReportRepository) {
    }

    /**
     * 今日接種した魔剤のリストを取得
     */
    public async fetchTodayMazaiInjectionList(): Promise<void> {
        this._todayMazaiInjectionList = await this.repository.getTodayMazaiInjectionList();
        this._todayMazaiInjectionListSubject$.next(this._todayMazaiInjectionList);
    }

    /**
     * 今日接種した魔剤の本数を取得
     */
    public async fetchTodayMazaiInjectionCount(): Promise<void> {
        this._todayMazaiInjectionCount = await this.repository.getTodayMazaiInjectionCount();
        this._todayMazaiInjectionCountSubject$.next(this._todayMazaiInjectionCount);
    }

    /**
     * 今日魔剤から接種したエナジーを取得
     * @returns 
     */
    public async fetchTodayEnergyReport(): Promise<void> {
        this._todayEnergyReport = await this.repository.getTodayEnergyInjection();
        this._todayEnergyReportSubject$.next(this._todayEnergyReport);
    }

    /**
     * 魔剤注入
     * 自動で、今日の注入数、カフェイン数、糖質、カロリーを再取得する
     * @param mazai 
     */
    public async injectionMazai(mazai: MazaiData): Promise<void> {
        await this.repository.injectionMazai(mazai);

        await this.fetchTodayMazaiInjectionCount();
        await this.fetchTodayEnergyReport();
    }

    /**
     * 魔剤注入削除
     * 自動で、今日の注入数、エナジーレポートを再取得する
     */
    public async deleteInjectionMazai(mazai: MazaiData, record: MazaiInjectionRecordData): Promise<void> {
        await this.repository.deleteInjectionMazai(mazai, record);

        await this.fetchTodayMazaiInjectionCount();
        await this.fetchTodayEnergyReport();
    }

    /**
     * 最後に注入した魔剤のレコードを取得
     */
    public async fetchLatestMazaiInjection(): Promise<void> {
        this._latestMazaiInjection = await this.repository.getLatestMazaiInjection();
        this._latestMazaiInjectionSubject$.next(this._latestMazaiInjection);
    }

}