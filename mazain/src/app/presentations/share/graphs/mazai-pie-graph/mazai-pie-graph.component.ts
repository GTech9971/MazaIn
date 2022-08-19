import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  //今週用の魔剤注入数リスト
  _rangeMazaiInjectionListCount: number[];
  readonly rangeMazaiInjectionListCountObserver: Observable<number[]>;


  constructor(private injectionWeekReportServiceSub: MazaiInjectionWeekReportService) {
    super(injectionWeekReportServiceSub);

    this._rangeMazaiInjectionListCount = [];
    this.rangeMazaiInjectionListCountObserver = this.injectionWeekReportServiceSub.RangeMazaiInjectionCountListObserver;
    this.rangeMazaiInjectionListCountObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._rangeMazaiInjectionListCount = list; });
  }


  async ngOnInit() {
    await this.injectionWeekReportServiceSub.fetchRangeMazaiInjectionCountList(startOfWeek(Date.now()).getTime(), endOfWeek(Date.now()).getTime());
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
        labels: ["A", "B"],
        datasets: [
          {
            label: "",
            data: [2, 3],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)'
            ],
          }
        ]
      },
    });
  }

  moveCurrentWeek(start: Date, end: Date): Promise<void> {
    throw new Error('Method not implemented.');
  }

  nextWeek(start: Date, end: Date): Promise<void> {
    throw new Error('Method not implemented.');
  }

  beforeWeek(start: Date, end: Date): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
