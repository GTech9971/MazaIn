import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
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

    //今日摂取したカフェイン
    private _todayCoffeInInTake: number = 0;
    private readonly _todayCoffeInInTakeSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    readonly TodayCoffeInInTakeObserver: Observable<number> = this._todayCoffeInInTakeSubject$.asObservable();

    //今日摂取した糖質
    private _todaySugarInTake: number = 0;
    private readonly _todaySugarInTakeSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    readonly TodaySugarInTakeObserver: Observable<number> = this._todaySugarInTakeSubject$.asObservable();

    //今日摂取したカロリー
    private _todayKcalInTake: number = 0;
    private readonly _todayKcalInTakeSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    readonly TodayKcalInTakeObserver: Observable<number> = this._todayKcalInTakeSubject$.asObservable();

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
     * 今日のカフェイン摂取量を取得
     * @returns 
     */
    public async fetchTodayCoffeInInTake(): Promise<void> {
        this._todayCoffeInInTake = await this.repository.getTodayCoffeInInTake();
        this._todayCoffeInInTakeSubject$.next(this._todayCoffeInInTake);
    }

    /**
     * 今日の糖質摂取量を取得
     * @returns 
     */
    public async fetchTodaySugarInTake(): Promise<void> {
        this._todaySugarInTake = await this.repository.getTodaySugarInTake();
        this._todaySugarInTakeSubject$.next(this._todaySugarInTake);
    }

    /**
     * 今日のカロリー摂取量を取得
     * @returns
     */
    public async fetchTodayKcalInTake(): Promise<void> {
        this._todayKcalInTake = await this.repository.getTodayKcalInTake();
        this._todayKcalInTakeSubject$.next(this._todayKcalInTake);
    }

    /**
     * 魔剤注入
     * 自動で、今日の注入数、カフェイン数、糖質、カロリーを再取得する
     * @param mazai 
     */
    public async injectionMazai(mazai: MazaiData): Promise<void> {
        await this.repository.injectionMazai(mazai);

        await this.fetchTodayMazaiInjectionCount();
        await this.fetchTodayCoffeInInTake();
        await this.fetchTodaySugarInTake();
        await this.fetchTodayKcalInTake();
    }

    /**
     * 最後に注入した魔剤のレコードを取得
     */
    public async fetchLatestMazaiInjection(): Promise<void> {
        this._latestMazaiInjection = await this.repository.getLatestMazaiInjection();
        this._latestMazaiInjectionSubject$.next(this._latestMazaiInjection);
    }



}