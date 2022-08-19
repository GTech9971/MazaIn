import { ChartOptions } from "chart.js";
import { addDays } from "date-fns";
import { MazaiInjectionReportService } from "src/app/domain/services/MazaiInjectionReport.service";

export abstract class MazaiGraph {

    protected readonly LINE_OPTIONS: ChartOptions = {
        scales: {
            yield: {
                min: 0,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    constructor(private injectionRecordService: MazaiInjectionReportService) {
    }

    /**
     * グラフを初期化する
     */
    abstract initializeGraph(start: Date, end: Date): void;


    /**
     * 今週にのデータを表示する
     * @param start 
     * @param end 
     */
    abstract moveCurrentWeek(start: Date, end: Date): Promise<void>;

    /**
     * 次の週のデータを表示する
     * @param start 
     * @param end 
     */
    abstract nextWeek(start: Date, end: Date): Promise<void>;

    /**
     * 前の週のデータを表示する
     * @param start 
     * @param end 
     */
    abstract beforeWeek(start: Date, end: Date): Promise<void>;


    /**
    * 開始期間〜終了期間内のラベルを取得する
    * @param startDate 
    * @param enDate 
    */
    protected createLabels(startDate: number, endDate: number): string[] {
        let work: Date = new Date(startDate);
        let labels: string[] = [];

        while (true) {
            if (this.injectionRecordService.equalDate(work.getTime(), addDays(endDate, 1).getTime())) {
                break;
            }

            labels.push(`${work.getMonth() + 1}/${work.getDate()}`);
            work = addDays(work, 1)
        }
        return labels;
    }

    /**
     * 今週のラベルを取得する   
     */
    protected createCurrentWeekLabels(start: Date, end: Date): string[] {
        return this.createLabels(start.getTime(), end.getTime());
    }

}