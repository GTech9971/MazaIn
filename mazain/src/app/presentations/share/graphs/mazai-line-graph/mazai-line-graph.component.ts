import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { addWeeks, endOfWeek, startOfWeek } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiInjectionReportService } from 'src/app/domain/services/MazaiInjectionReport.service';
import { MazaiGraph } from '../MazaiGraph';

@Component({
  selector: 'app-mazai-line-graph',
  templateUrl: './mazai-line-graph.component.html',
  styleUrls: ['./mazai-line-graph.component.scss'],
})
export class MazaiLineGraphComponent extends MazaiGraph implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChart: Chart;

  private readonly destroy$: Subject<void> = new Subject<void>();

  //今週用の魔剤注入数リスト
  _rangeMazaiInjectionListCount: number[];
  readonly rangeMazaiInjectionListCountObserver: Observable<number[]>;

  //前の週用の魔剤注入リスト
  _beforeMazaiInjectionListCount: number[];
  readonly beforeRangeMazaiInjectionListCountObserver: Observable<number[]>;

  constructor(private injectionRecordServiceSub: MazaiInjectionReportService) {
    super(injectionRecordServiceSub);

    this._rangeMazaiInjectionListCount = [];
    this.rangeMazaiInjectionListCountObserver = this.injectionRecordServiceSub.RangeMazaiInjectionCountListObserver;
    this.rangeMazaiInjectionListCountObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._rangeMazaiInjectionListCount = list; });

    this._beforeMazaiInjectionListCount = [];
    this.beforeRangeMazaiInjectionListCountObserver = this.injectionRecordServiceSub.BeforeRangeMazaiInjectionCountListObserver;
    this.beforeRangeMazaiInjectionListCountObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._beforeMazaiInjectionListCount = list });
  }


  async ngOnInit() {
    await this.injectionRecordServiceSub.fetchRangeMazaiInjectionCountList(startOfWeek(new Date()).getTime(), endOfWeek(new Date()).getTime());
    await this.injectionRecordServiceSub.fetchBeforeRangeMazaiInjectionCountList(addWeeks(new Date(), -1).getTime(), addWeeks(new Date(), -1).getTime());
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngAfterViewInit(): void {
    this.initializeGraph(startOfWeek(Date.now()), endOfWeek(Date.now()));
  }


  public initializeGraph(start: Date, end: Date) {
    if (this.lineChart) { this.lineChart.destroy(); }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.createCurrentWeekLabels(start, end),
        datasets: [
          {
            label: `${start.getMonth() + 1}/${end.getDate()}の週`,
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
            label: `${addWeeks(start, -1).getMonth() + 1}/${addWeeks(end, -1).getDate()}の週`,
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
      options: this.LINE_OPTIONS,
    });
  }

  public async moveCurrentWeek(start: Date, end: Date): Promise<void> {
    await this.injectionRecordServiceSub.fetchRangeMazaiInjectionCountList(start.getTime(), end.getTime());
    await this.injectionRecordServiceSub.fetchBeforeRangeMazaiInjectionCountList(addWeeks(start, -1).getTime(), addWeeks(end, -1).getTime());
    this.initializeGraph(start, end);
  }

  public async nextWeek(start: Date, end: Date): Promise<void> {
    await this.injectionRecordServiceSub.fetchRangeMazaiInjectionCountList(start.getTime(), end.getTime());
    await this.injectionRecordServiceSub.fetchBeforeRangeMazaiInjectionCountList(addWeeks(start, -1).getTime(), addWeeks(end, -1).getTime());
    this.initializeGraph(start, end);
  }

  public async beforeWeek(start: Date, end: Date): Promise<void> {
    await this.injectionRecordServiceSub.fetchRangeMazaiInjectionCountList(start.getTime(), end.getTime());
    await this.injectionRecordServiceSub.fetchBeforeRangeMazaiInjectionCountList(addWeeks(start, -1).getTime(), addWeeks(end, -1).getTime());
    this.initializeGraph(start, end);
  }

}
