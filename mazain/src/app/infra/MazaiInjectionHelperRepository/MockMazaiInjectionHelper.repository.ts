import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiHelpContextData } from "src/app/domain/models/MazaiHelpContext.data";
import { MazaiInjectionHelperRepository } from "src/app/domain/repositories/MazaiInjectionHelper.repository";

@Injectable({
    providedIn: 'root'
})
export class MockMazaiInjectionHelperRepository extends MazaiInjectionHelperRepository {

    constructor() {
        super();
    }

    async getHelpContext(energyReport: EnergyInjectionReportData): Promise<MazaiHelpContextData> {
        return {
            TitleComment: "カフェイン取りすぎ",
            Comment: "危険なライン これ以上の接種は一日のカフェイン摂取量を上回ります。"
        };
    }
}