import { Injectable } from "@angular/core";
import { ApplicationConst } from "src/app/consts/Application.const";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiInjectionRecordData } from "src/app/domain/models/MazaiInjectionRecord.data";
import { MazaiInjectionBaseReportRepository } from "src/app/domain/repositories/MazaiInjectionBaseReport.repository";
import { StorageService } from "src/app/domain/services/Storage.service";

@Injectable({
    providedIn: 'root'
})
export class MazaiInjectionBaseReportImplRepository extends MazaiInjectionBaseReportRepository {


    constructor(private storageService: StorageService) {
        super();
    }

    async getMazaiInjectionList(targetDate: Date): Promise<MazaiData[]> {
        let todayList: MazaiData[] = [];

        await this.storageService.Storage.forEach((val: string, key: string) => {
            if (key.includes(ApplicationConst.MAZAI_KEY)) {
                //今日接種したか                
                const work: MazaiData = JSON.parse(val);
                work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                    return this.containsDate(targetDate, record);
                })

                if (work.MazaiInjectionDataList.length > 0) {
                    todayList.push(work);
                }
            }
        });
        return todayList;
    }

    async getMazaiInjectionCount(targetDate: Date): Promise<number> {
        let injectionCount: number = 0;
        await this.storageService.Storage.forEach((val: string, key: string) => {
            if (key.includes(ApplicationConst.MAZAI_KEY)) {
                const m: MazaiData = JSON.parse(val);
                m.MazaiInjectionDataList.forEach(record => {
                    if (this.containsDate(targetDate, record)) {
                        injectionCount++;
                    }
                });
            }
        });

        return injectionCount;
    }

    async getEnergyInjection(targetDate: Date): Promise<EnergyInjectionReportData> {
        const list = await this.getMazaiInjectionList(targetDate);
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

    async injectionMazai(targetDate: Date, mazai: MazaiData): Promise<void> {
        const jsonStr: string = await this.storageService.get(ApplicationConst.getMazaiStorageKey(mazai));
        const target: MazaiData = JSON.parse(jsonStr);
        target.MazaiInjectionDataList.push(this.createInjectionRecord(targetDate));
        await this.storageService.set(ApplicationConst.getMazaiStorageKey(mazai), JSON.stringify(target));
    }

    async deleteInjectionMazai(mazai: MazaiData, record: MazaiInjectionRecordData): Promise<void> {
        const jsonStr: string = await this.storageService.get(ApplicationConst.getMazaiStorageKey(mazai));
        const work: MazaiData = JSON.parse(jsonStr);
        work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(r => {
            return r.InjecionDateTime !== record.InjecionDateTime;
        });
        await this.storageService.set(ApplicationConst.getMazaiStorageKey(work), JSON.stringify(work));
    }

    async getLatestMazaiInjection(targetDate: Date): Promise<MazaiData> {
        let latestMazai: MazaiData;
        let latestRecord: MazaiInjectionRecordData;
        let list: MazaiData[] = await this.getMazaiInjectionList(targetDate);

        list.forEach(m => {
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
        });
        return latestMazai;
    }


}