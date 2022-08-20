import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EnergyInjectionReportData } from 'src/app/domain/models/EnergyInjectionReport.data';
import { MazaiInjectionWeekReportService } from 'src/app/domain/services/MazaiInjectionWeekReport.service';
import { MazaiGraph } from '../MazaiGraph';

@Component({
  selector: 'app-mazai-bar-graph',
  templateUrl: './mazai-bar-graph.component.html',
  styleUrls: ['./mazai-bar-graph.component.scss'],
})
export class MazaiBarGraphComponent extends MazaiGraph implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  barChart: Chart;

  private readonly destroy$: Subject<void> = new Subject<void>();

  private _rangeEnergyReportList: EnergyInjectionReportData[];
  readonly rangeEnergyReportListObserver: Observable<EnergyInjectionReportData[]>;

  constructor(private injectionWeekReportServiceSub: MazaiInjectionWeekReportService) {
    super(injectionWeekReportServiceSub);

    this._rangeEnergyReportList = [];
    this.rangeEnergyReportListObserver = this.injectionWeekReportServiceSub.RangeEnergyReportListObserver;
    this.rangeEnergyReportListObserver.pipe(takeUntil(this.destroy$)).subscribe(list => { this._rangeEnergyReportList = list });
  }

  async ngOnInit() {
    await this.injectionWeekReportServiceSub.fetchRangeEnergyReportList(startOfWeek(Date.now()).getTime(), endOfWeek(Date.now()).getTime());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.initializeGraph(startOfWeek(Date.now()), endOfWeek(Date.now()));
  }


  initializeGraph(start: Date, end: Date): void {
    if (this.barChart) { this.barChart.destroy(); }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.createCurrentWeekLabels(start, end),
        datasets: [
          {
            label: "カフェイン",
            data: this._rangeEnergyReportList.map(report => { return report.CoffeInIntake; }),
            backgroundColor: ['rgba(255, 205, 86, 0.2)',],
            borderColor: ['rgba(255, 205, 86)',],
            borderWidth: 1
          },
          {
            label: "糖質",
            data: this._rangeEnergyReportList.map(report => { return report.SugarInTake; }),
            backgroundColor: ['rgba(75, 192, 192, 0.2)',],
            borderColor: ['rgba(75, 192, 192)',],
            borderWidth: 1
          },
          {
            label: "カロリー",
            data: this._rangeEnergyReportList.map(report => { return report.KcalInTake; }),
            backgroundColor: ['rgba(54, 162, 235, 0.2)',],
            borderColor: ['rgba(54, 162, 235)',],
            borderWidth: 1
          }
        ]
      },
      options: this.LINE_OPTIONS,
    });
  }


  async moveCurrentWeek(start: Date, end: Date): Promise<void> {
    await this.injectionWeekReportServiceSub.fetchRangeEnergyReportList(start.getTime(), end.getTime());
    this.initializeGraph(start, end);
  }

  async nextWeek(start: Date, end: Date): Promise<void> {
    await this.injectionWeekReportServiceSub.fetchRangeEnergyReportList(start.getTime(), end.getTime());
    this.initializeGraph(start, end);
  }

  async beforeWeek(start: Date, end: Date): Promise<void> {
    await this.injectionWeekReportServiceSub.fetchRangeEnergyReportList(start.getTime(), end.getTime());
    this.initializeGraph(start, end);
  }

}
