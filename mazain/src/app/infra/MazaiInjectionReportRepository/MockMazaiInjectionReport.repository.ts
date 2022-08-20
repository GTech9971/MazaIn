import { Injectable } from "@angular/core";
import { EnergyInjectionReportData } from "src/app/domain/models/EnergyInjectionReport.data";
import { MazaiData } from "src/app/domain/models/Mazai.data";
import { MazaiInjectionRecordData } from "src/app/domain/models/MazaiInjectionRecord.data";
import { MazaiInjectionReportRepository } from "src/app/domain/repositories/MazaiInjectionReport.repository";
import { MockMazaiRepository } from "../MazaiRepository/MockMazai.repository";

@Injectable({
    providedIn: 'root'
})
export class MockMazaiInjectionReportRepository extends MazaiInjectionReportRepository {

    constructor(private mazaiRepository: MockMazaiRepository) {
        super();
    }

    async getTodayMazaiInjectionList(): Promise<MazaiData[]> {
        let todayList: MazaiData[] = [];
        const NOW: Date = new Date();
        this.mazaiRepository.mazaiList.forEach(m => {
            //今日接種したか
            const jsonStr: string = JSON.stringify(m);
            let work: MazaiData = JSON.parse(jsonStr);
            work.MazaiInjectionDataList = work.MazaiInjectionDataList.filter(record => {
                return this.containsToday(record, NOW);
            })

            if (work.MazaiInjectionDataList.length > 0) {
                todayList.push(work);
            }
        });
        return todayList;
    }

    async getTodayMazaiInjectionCount(): Promise<number> {
        let injectionCount: number = 0;
        const NOW: Date = new Date();
        this.mazaiRepository.mazaiList.forEach(m => {
            m.MazaiInjectionDataList.forEach(record => {
                if (this.containsToday(record, NOW)) {
                    injectionCount++;
                }
            });
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
        this.mazaiRepository.mazaiList.forEach(m => {
            if (mazai.MazaiId === m.MazaiId) {
                m.MazaiInjectionDataList.push(this.createInjectionRecord());
            }
        });
    }

    async getLatestMazaiInjection(): Promise<MazaiData> {
        let latestMazai: MazaiData;
        let latestRecord: MazaiInjectionRecordData;
        this.mazaiRepository.mazaiList.forEach(m => {
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