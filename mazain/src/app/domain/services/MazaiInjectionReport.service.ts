import { Injectable } from "@angular/core";
import { addDays } from "date-fns";
import { BehaviorSubject, Observable } from "rxjs";
import { MazaiData } from "../models/Mazai.data";
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

    //期間内に注入した魔剤のリスト
    private _rangeMazaiInjectionList: MazaiData[] = [];
    private readonly _rangeMazaiInjectionListSubject$: BehaviorSubject<MazaiData[]> = new BehaviorSubject<MazaiData[]>([]);
    readonly RangeMazaiInjectionListObserver: Observable<MazaiData[]> = this._rangeMazaiInjectionListSubject$.asObservable();
    //期間内に注入した魔剤の数のリスト
    private _rangeMazaiInjectionCountList: number[] = [];
    private readonly _rangeMazaiInjectionCountListSubject$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    readonly RangeMazaiInjectionCountListObserver: Observable<number[]> = this._rangeMazaiInjectionCountListSubject$.asObservable();

    //前の週の期間内に注入した魔剤のリスト
    private _beforeRangeMazaiInjectionList: MazaiData[] = [];
    private readonly _beforeRangeMazaiInjectionListSubject$: BehaviorSubject<MazaiData[]> = new BehaviorSubject<MazaiData[]>([]);
    readonly BeforeRangeMazaiInjectionListObserver: Observable<MazaiData[]> = this._beforeRangeMazaiInjectionListSubject$.asObservable();
    //前の週の期間内に注入した魔剤の数のリスト
    private _beforeRangeMazaiInjectionCountList: number[] = [];
    private readonly _beforeRangeMazaiInjectionCountListSubject$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    readonly BeforeRangeMazaiInjectionCountListObserver: Observable<number[]> = this._beforeRangeMazaiInjectionCountListSubject$.asObservable();

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


    public equalDate(date1: number, date2: number): boolean {
        const DATE1: Date = new Date(date1);
        const DATE1_NUM: number = DATE1.getFullYear() + DATE1.getMonth() + DATE1.getDate();
        const DATE2: Date = new Date(date2);
        const DATE2_NUM: number = DATE2.getFullYear() + DATE2.getMonth() + DATE2.getDate();

        return DATE1_NUM === DATE2_NUM;
    }

    private getInjectionCountByDate(mazai: MazaiData, date: Date): number {
        let injectionCount: number = 0;
        mazai.MazaiInjectionDataList.forEach(record => {
            if (this.equalDate(record.InjecionDateTime, date.getTime())) {
                injectionCount++;
            }
        });
        return injectionCount;
    }

    /**
     * 期間内に注入した魔剤リストを取得
     * @param startDate 
     * @param endDate 
     */
    public async fetchRangeMazaiInjectionList(startDate: number, endDate: number): Promise<void> {
        this._rangeMazaiInjectionList = await this.repository.getRangeMazaiInjectionList(startDate, endDate);
        this._rangeMazaiInjectionListSubject$.next(this._rangeMazaiInjectionList);
    }

    /**
     * 期間内に注入した魔剤リストを取得(前の週用)
     * @param startDate 
     * @param endDate 
    */
    public async fetchBeforeRangeMazaiInjectionList(startDate: number, endDate: number): Promise<void> {
        this._beforeRangeMazaiInjectionList = await this.repository.getRangeMazaiInjectionList(startDate, endDate);
        this._beforeRangeMazaiInjectionListSubject$.next(this._beforeRangeMazaiInjectionList);
    }


    /**
     * 期間内に注入した魔剤の数リストを取得する
     * @param startDate 
     * @param endDate 
     */
    public async fetchRangeMazaiInjectionCountList(startDate: number, endDate: number): Promise<void> {
        await this.fetchRangeMazaiInjectionList(startDate, endDate);

        this._rangeMazaiInjectionCountList = [];
        let workDate: Date = new Date(startDate);
        while (true) {
            if (this.equalDate(workDate.getTime(), addDays(endDate, 1).getTime())) {
                break;
            }

            let injectionSum: number = 0;
            this._rangeMazaiInjectionList.forEach(m => {
                injectionSum += this.getInjectionCountByDate(m, workDate);
            });
            this._rangeMazaiInjectionCountList.push(injectionSum);

            workDate = addDays(workDate, 1);
        }
        this._rangeMazaiInjectionCountListSubject$.next(this._rangeMazaiInjectionCountList);
    }

    /**
    * 期間内に注入した魔剤の数リストを取得する(前の週用)
    * @param startDate 
    * @param endDate 
    */
    public async fetchBeforeRangeMazaiInjectionCountList(startDate: number, endDate: number): Promise<void> {
        await this.fetchBeforeRangeMazaiInjectionList(startDate, endDate);

        this._beforeRangeMazaiInjectionCountList = [];
        let workDate: Date = new Date(startDate);
        while (true) {
            if (this.equalDate(workDate.getTime(), addDays(endDate, 1).getTime())) {
                break;
            }

            let injectionSum: number = 0;
            this._beforeRangeMazaiInjectionList.forEach(m => {
                injectionSum += this.getInjectionCountByDate(m, workDate);
            });
            this._beforeRangeMazaiInjectionCountList.push(injectionSum);

            workDate = addDays(workDate, 1);
        }
        this._beforeRangeMazaiInjectionCountListSubject$.next(this._beforeRangeMazaiInjectionCountList);
    }

}