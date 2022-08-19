import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { Observable, Subject } from 'rxjs';
import { addDays, addWeeks, endOfWeek, startOfWeek } from "date-fns";
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit, OnDestroy {
  readonly LINE_OPTIONS: ChartOptions = {
    scales: {
      yield: {
        min: 0,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChart: Chart;

  private readonly destroy$: Subject<void> = new Subject<void>();

  //今週用の魔剤注入数リスト
  _rangeMazaiInjectionListCount: number[];
  readonly rangeMazaiInjectionListCountObserver: Observable<number[]>;

  //前の週用の魔剤注入リスト
  _beforeMazaiInjectionListCount: number[];
  readonly beforeRangeMazaiInjectionListCountObserver: Observable<number[]>;

  _workDate: Date;

  get startOfWeek(): Date { return startOfWeek(this._workDate); }
  get endOfWeek(): Date { return endOfWeek(this._workDate); }

  constructor(private injectionRecordService: MazaiInjectionReportService) {
    Chart.register(...registerables);
    this._workDate = startOfWeek(new Date());
    this._rangeMazaiInjectionListCount = [];
    this.rangeMazaiInjectionListCountObserver = this.injectionRecordService.RangeMazaiInjectionCountListObserver;
    this.rangeMazaiInjectionListCountObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._rangeMazaiInjectionListCount = list; });

    this._beforeMazaiInjectionListCount = [];
    this.beforeRangeMazaiInjectionListCountObserver = this.injectionRecordService.BeforeRangeMazaiInjectionCountListObserver;
    this.beforeRangeMazaiInjectionListCountObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._beforeMazaiInjectionListCount = list });
  }



  async ngOnInit() {
    this._workDate = new Date();
    this._workDate = startOfWeek(this._workDate);
    await this.injectionRecordService.fetchRangeMazaiInjectionCountList(this.startOfWeek.getTime(), this.endOfWeek.getTime());
    await this.injectionRecordService.fetchBeforeRangeMazaiInjectionCountList(addWeeks(this.startOfWeek, -1).getTime(), addWeeks(this.endOfWeek, -1).getTime());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ionViewDidEnter(): void {
    this.initializeGraph();
  }


  initializeGraph() {
    if (this.lineChart) { this.lineChart.destroy(); }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.createCurrentWeekLabels(),
        datasets: [
          {
            label: `${this.startOfWeek.getMonth() + 1}/${this.startOfWeek.getDate()}の週`,
            data: this._rangeMazaiInjectionListCount,
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          },
          {
            label: `${addWeeks(this.startOfWeek, -1).getMonth() + 1}/${addWeeks(this.startOfWeek, -1).getDate()}の週`,
            data: this._beforeMazaiInjectionListCount,
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: this.LINE_OPTIONS
    });
  }


  /**
   * 今週に戻るボタン
   */
  async onClickTodayBtn() {
    this._workDate = new Date();
    this._workDate = startOfWeek(this._workDate);
    await this.injectionRecordService.fetchRangeMazaiInjectionCountList(this.startOfWeek.getTime(), this.endOfWeek.getTime());
    await this.injectionRecordService.fetchBeforeRangeMazaiInjectionCountList(addWeeks(this.startOfWeek, -1).getTime(), addWeeks(this.endOfWeek, -1).getTime());
    this.lineChart.destroy();
    this.initializeGraph();
  }

  /**
   * 次の週表示ボタン押下時
   */
  async onClickNextWeekBtn() {
    this._workDate = addWeeks(this._workDate, 1);
    await this.injectionRecordService.fetchRangeMazaiInjectionCountList(this.startOfWeek.getTime(), this.endOfWeek.getTime());
    await this.injectionRecordService.fetchBeforeRangeMazaiInjectionCountList(addWeeks(this.startOfWeek, -1).getTime(), addWeeks(this.endOfWeek, -1).getTime());
    this.lineChart.destroy();
    this.initializeGraph();
  }

  /**
   * 前の週表示ボタン押下時
   */
  async onClickBeforeWeekBtn() {
    this._workDate = addWeeks(this._workDate, -1);
    await this.injectionRecordService.fetchRangeMazaiInjectionCountList(this.startOfWeek.getTime(), this.endOfWeek.getTime());
    await this.injectionRecordService.fetchBeforeRangeMazaiInjectionCountList(addWeeks(this.startOfWeek, -1).getTime(), addWeeks(this.endOfWeek, -1).getTime());
    this.lineChart.destroy();
    this.initializeGraph();
  }


  /**
   * 開始期間〜終了期間内のラベルを取得する
   * @param startDate 
   * @param enDate 
   */
  private createLabels(startDate: number, endDate: number): string[] {
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
  private createCurrentWeekLabels(): string[] {
    return this.createLabels(this.startOfWeek.getTime(), this.endOfWeek.getTime());
  }

}
