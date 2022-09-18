import { Injectable } from "@angular/core";
import { addDays } from "date-fns";
import { MazaiInjectionBaseReportRepository } from "../repositories/MazaiInjectionBaseReport.repository";
import { MazaiInjectionBaseReportService } from "./MazaiInjectionBaseReport.service";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionVariableReportService extends MazaiInjectionBaseReportService {

    private _workDate: Date;

    public get WorkDate(): Date { return new Date(this._workDate); }
    private set WorkDate(val: Date) { this._workDate = val; }

    constructor(private repositorySub: MazaiInjectionBaseReportRepository) {
        super(repositorySub);
        this._workDate = new Date();
    }

    /**
     * 作業日を前日に設定する
     * @returns 
     */
    public async prevWorkDate(): Promise<Date> {
        this.WorkDate = addDays(this._workDate, -1);

        await this.changeWorkDate();

        return this.WorkDate;
    }

    /**
     * 作業日を次の日に設定する
     * @returns 
     */
    public async nextWorkDate(): Promise<Date> {
        this.WorkDate = addDays(this._workDate, 1);

        await this.changeWorkDate();

        return this.WorkDate;
    }


    private async changeWorkDate(): Promise<void> {
        await this.fetchMazaiInjectionList();
        await this.fetchEnergyReport();
        await this.fetchLatestMazaiInjection();
        await this.fetchMazaiInjectionCount();
    }

}