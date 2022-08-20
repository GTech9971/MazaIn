import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EnergyInjectionReportData } from "../models/EnergyInjectionReport.data";
import { MazaiHelpContextData } from "../models/MazaiHelpContext.data";
import { MazaiInjectionHelperRepository } from "../repositories/MazaiInjectionHelper.repository";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionHelperService {

    private _helperComment: MazaiHelpContextData;
    private readonly _helperCommentSubject$: BehaviorSubject<MazaiHelpContextData>;
    readonly HelperCommentObserver: Observable<MazaiHelpContextData>;

    constructor(private repository: MazaiInjectionHelperRepository) {
        this._helperCommentSubject$ = new BehaviorSubject<MazaiHelpContextData>(undefined);
        this.HelperCommentObserver = this._helperCommentSubject$.asObservable();
    }

    /**
     * ヘルプコメントを取得する
     * @param energyReport 
     */
    public async fetchHelperComment(energyReport: EnergyInjectionReportData): Promise<void> {
        this._helperComment = await this.repository.getHelpContext(energyReport);
        this._helperCommentSubject$.next(this._helperComment);
    }
}