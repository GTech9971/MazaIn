import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiRationReportData } from 'src/app/domain/models/MazaiRationReport.data';
import { MazaiInjectionWeekReportService } from 'src/app/domain/services/MazaiInjectionWeekReport.service';
import { MazaiGraph } from '../MazaiGraph';

@Component({
  selector: 'app-mazai-pie-graph',
  templateUrl: './mazai-pie-graph.component.html',
  styleUrls: ['./mazai-pie-graph.component.scss'],
})
export class MazaiPieGraphComponent extends MazaiGraph implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('pieCanvas') private pieCanvas: ElementRef;
  pieChart: Chart;

  private readonly destroy$: Subject<void> = new Subject<void>();

  //魔剤注入割合リスト
  _rangeMazaiRaionList: MazaiRationReportData[];
  readonly rangeMazaiRationListObserver: Observable<MazaiRationReportData[]>;

  constructor(private injectionWeekReportServiceSub: MazaiInjectionWeekReportService) {
    super(injectionWeekReportServiceSub);

    this._rangeMazaiRaionList = [];
    this.rangeMazaiRationListObserver = this.injectionWeekReportServiceSub.RangeMazaiRationListObserver;
    this.rangeMazaiRationListObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._rangeMazaiRaionList = list });
  }


  async ngOnInit() {
    await this.injectionWeekReportServiceSub.fetchRangeMazaiInjectionCountList(startOfWeek(Date.now()).getTime(), endOfWeek(Date.now()).getTime());
    await this.injectionWeekReportServiceSub.fetchRangeMazaiRationList(startOfWeek(Date.now()).getTime(), endOfWeek(Date.now()).getTime());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.initializeGraph(startOfWeek(Date.now()), endOfWeek(Date.now()));
  }

  initializeGraph(start: Date, end: Date): void {
    if (this.pieChart) { this.pieChart.destroy(); }

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this._rangeMazaiRaionList.map(ration => { return ration.MazaiName }),
        datasets: [
          {
            label: "",
            data: this._rangeMazaiRaionList.map(ratio => { return ratio.InjectionCount }),
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
          }
        ]
      },
    });
  }

  async moveCurrentWeek(start: Date, end: Date): Promise<void> {
    await this.injectionWeekReportServiceSub.fetchRangeMazaiRationList(start.getTime(), end.getTime());
    this.initializeGraph(start, end);
  }

  async nextWeek(start: Date, end: Date): Promise<void> {
    await this.injectionWeekReportServiceSub.fetchRangeMazaiRationList(start.getTime(), end.getTime());
    this.initializeGraph(start, end);
  }

  async beforeWeek(start: Date, end: Date): Promise<void> {
    await this.injectionWeekReportServiceSub.fetchRangeMazaiRationList(start.getTime(), end.getTime());
    this.initializeGraph(start, end);
  }

}
