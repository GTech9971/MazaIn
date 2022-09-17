import { Injectable } from "@angular/core";
import { MazaiInjectionBaseReportRepository } from "../repositories/MazaiInjectionBaseReport.repository";
import { MazaiInjectionBaseReportService } from "./MazaiInjectionBaseReport.service";

/**
 * 今日の魔剤注入に関するサービス
 */
@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionTodayReportService extends MazaiInjectionBaseReportService {

    /**
     * つねに今日を返す
     */
    public get WorkDate(): Date {
        return new Date();
    }
    private set WorkDate(val: Date) { }

    constructor(private repositorySub: MazaiInjectionBaseReportRepository) {
        super(repositorySub);
    }

}