import { Injectable } from "@angular/core";
import { ApplicationConst } from "src/app/consts/Application.const";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiInjectionRecordData } from "src/app/domain/models/MazaiInjectionRecord.data";
import { MazaiInjectionReportRepository } from "src/app/domain/repositories/MazaiInjectionReport.repository";
import { StorageService } from "src/app/domain/services/Storage.service";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionReportImplRepository extends MazaiInjectionReportRepository {

    constructor(private storageService: StorageService) {
        super();
    }

    async getTodayMazaiInjectionList(): Promise<MazaiData[]> {
        let todayList: MazaiData[] = [];
        const NOW: Date = new Date();
        await this.storageService.Storage.forEach((val: string, key: string) => {
            if (key.includes(ApplicationConst.MAZAI_LIST_KEY)) {
                //今日接種したか                
                const work: MazaiData = JSON.parse(val);
                work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                    return this.containsToday(record, NOW);
                })

                if (work.MazaiInjectionDataList.length > 0) {
                    todayList.push(work);
                }
            }
        });
        return todayList;
    }

    async getTodayMazaiInjectionCount(): Promise<number> {
        let injectionCount: number = 0;
        const NOW: Date = new Date();
        await this.storageService.Storage.forEach((val: string, key: string) => {
            if (key.includes(ApplicationConst.MAZAI_LIST_KEY)) {
                const m: MazaiData = JSON.parse(val);
                m.MazaiInjectionDataList.forEach(record => {
                    if (this.containsToday(record, NOW)) {
                        injectionCount++;
                    }
                });
            }
        });

        return injectionCount;
    }

    async getTodayEnergyInjection(): Promise<EnergyInjectionReportData> {
        const list = await this.getTodayMazaiInjectionList();
        let coffeInInTake: number = 0;
        let sugarInTake: number = 0;
        let kcalInTake: number = 0;
        list.forEach(m => {
            coffeInInTake += m.MzaiCoffeIn * m.MazaiInjectionDataList.length;
            sugarInTake += m.MazaiSugar * m.MazaiInjectionDataList.length;
            kcalInTake += m.MazaiKcal * m.MazaiInjectionDataList.length;
        });

        const enrgyReport: EnergyInjectionReportData = {
            CoffeInIntake: coffeInInTake,
            SugarInTake: sugarInTake,
            KcalInTake: kcalInTake
        };
        return enrgyReport;
    }

    async injectionMazai(mazai: MazaiData): Promise<void> {
        const jsonStr: string = await this.storageService.get(ApplicationConst.getMazaiStorageKey(mazai));
        const target: MazaiData = JSON.parse(jsonStr);
        target.MazaiInjectionDataList.push(this.createInjectionRecord());
        await this.storageService.set(ApplicationConst.getMazaiStorageKey(mazai), JSON.stringify(target));
    }

    async getLatestMazaiInjection(): Promise<MazaiData> {
        let latestMazai: MazaiData;
        let latestRecord: MazaiInjectionRecordData;
        await this.storageService.Storage.forEach((val: string, key: string) => {
            if (key.includes(ApplicationConst.MAZAI_LIST_KEY)) {
                const m: MazaiData = JSON.parse(val);
                m.MazaiInjectionDataList.forEach(record => {
                    if (latestRecord === undefined) {
                        latestRecord = record;
                        latestMazai = m;
                    }

                    if (latestRecord.InjecionDateTime < record.InjecionDateTime) {
                        latestRecord = record;
                        latestMazai = m;
                    }
                });
            }
        });

        return latestMazai;
    }

}