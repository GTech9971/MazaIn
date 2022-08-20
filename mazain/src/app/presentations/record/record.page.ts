import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import { MazaiBarGraphComponent } from '../share/graphs/mazai-bar-graph/mazai-bar-graph.component';
import { MazaiLineGraphComponent } from '../share/graphs/mazai-line-graph/mazai-line-graph.component';
import { MazaiPieGraphComponent } from '../share/graphs/mazai-pie-graph/mazai-pie-graph.component';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit, AfterViewInit {
  @ViewChild("mazaiLineGraph") mazaiLineGraph: MazaiLineGraphComponent;
  @ViewChild("mazaiPieGraph") mazaiPieGraph: MazaiPieGraphComponent;
  @ViewChild("mazaiBarGraph") mazaiBarGraph: MazaiBarGraphComponent;

  _workDate: Date;

  get startOfWeek(): Date { return startOfWeek(this._workDate); }
  get endOfWeek(): Date { return endOfWeek(this._workDate); }

  constructor() {
    Chart.register(...registerables);
    this._workDate = startOfWeek(new Date());
  }


  ngOnInit() {
    this._workDate = new Date();
    this._workDate = startOfWeek(this._workDate);
  }

  /** タブ遷移後 */
  async ionViewDidEnter() {
    await this.onClickTodayBtn();
  }

  async ngAfterViewInit() {
    await this.onClickTodayBtn();
  }

  /**
   * 今週に戻るボタン
   */
  async onClickTodayBtn() {
    this._workDate = new Date();
    this._workDate = startOfWeek(this._workDate);
    await this.mazaiLineGraph.moveCurrentWeek(this.startOfWeek, this.endOfWeek);
    await this.mazaiBarGraph.moveCurrentWeek(this.startOfWeek, this.endOfWeek);
    await this.mazaiPieGraph.moveCurrentWeek(this.startOfWeek, this.endOfWeek);
  }

  /**
   * 次の週表示ボタン押下時
   */
  async onClickNextWeekBtn() {
    this._workDate = addWeeks(this._workDate, 1);
    await this.mazaiLineGraph.nextWeek(this.startOfWeek, this.endOfWeek);
    await this.mazaiBarGraph.nextWeek(this.startOfWeek, this.endOfWeek);
    await this.mazaiPieGraph.nextWeek(this.startOfWeek, this.endOfWeek);
  }

  /**
   * 前の週表示ボタン押下時
   */
  async onClickBeforeWeekBtn() {
    this._workDate = addWeeks(this._workDate, -1);
    await this.mazaiLineGraph.beforeWeek(this.startOfWeek, this.endOfWeek);
    await this.mazaiBarGraph.beforeWeek(this.startOfWeek, this.endOfWeek);
    await this.mazaiPieGraph.beforeWeek(this.startOfWeek, this.endOfWeek);
  }

}
