import { Injectable } from "@angular/core";
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
            m.MazaiInjectionDataList = m.MazaiInjectionDataList.filter(record => {
                return this.containsToday(record, NOW);
            })

            if (m.MazaiInjectionDataList.length > 0) {
                todayList.push(m);
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

    async getTodayCoffeInInTake(): Promise<number> {
        let sum: number = 0;
        this.mazaiRepository.mazaiList.forEach(m => {
            sum += m.MzaiCoffeIn * m.MazaiInjectionDataList.length;
        });
        return sum;
    }

    async getTodaySugarInTake(): Promise<number> {
        let sum: number = 0;
        this.mazaiRepository.mazaiList.forEach(m => {
            sum += m.MazaiSugar * m.MazaiInjectionDataList.length;
        });
        return sum;
    }

    async getTodayKcalInTake(): Promise<number> {
        let sum: number = 0;
        this.mazaiRepository.mazaiList.forEach(m => {
            sum += m.MazaiKcal * m.MazaiInjectionDataList.length;
        });
        return sum;
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