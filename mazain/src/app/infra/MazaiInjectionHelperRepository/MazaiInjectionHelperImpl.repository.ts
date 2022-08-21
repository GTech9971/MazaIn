import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiHelpContextData } from "src/app/domain/models/MazaiHelpContext.data";
import { MazaiInjectionHelperRepository } from "src/app/domain/repositories/MazaiInjectionHelper.repository";
import { StorageService } from "src/app/domain/services/Storage.service";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionHelperImplRepository extends MazaiInjectionHelperRepository {

    constructor(private storageService: StorageService) {
        super();
    }

    getHelpContext(energyReport: EnergyInjectionReportData): Promise<MazaiHelpContextData> {
        //TODO
        throw new Error("Method not implemented.");
    }

}