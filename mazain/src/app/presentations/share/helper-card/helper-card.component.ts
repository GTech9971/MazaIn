import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MazaiInjectionHelperService } from 'src/app/domain/services/MazaiInjectionHelper.service';

@Component({
  selector: 'app-helper-card',
  templateUrl: './helper-card.component.html',
  styleUrls: ['./helper-card.component.scss'],
})
export class HelperCardComponent implements OnInit, OnDestroy {

  /** カフェイン総量 */
  @Input() coffeInTake: number;
  /** 糖質総量 */
  @Input() sugarInTake: number;
  /** カロリー総量 */
  @Input() kcalInTake: number;

  private destroy$: Subject<void> = new Subject<void>();

  _helperCommentTitle: string;
  readonly helperCommentTitleObserver: Observable<string>;

  _helperComment: string;
  readonly helperCommentObserver: Observable<string>;

  constructor(private injectionHelperService: MazaiInjectionHelperService) {
    this._helperCommentTitle = "";
    this.helperCommentTitleObserver = this.injectionHelperService.HelperCommentTitleObserver;
    this.helperCommentTitleObserver.pipe(takeUntil(this.destroy$)).subscribe(title => { this._helperCommentTitle = title; });

    this._helperComment = "";
    this.helperCommentObserver = this.injectionHelperService.HelperCommentObserver;
    this.helperCommentObserver.pipe(takeUntil(this.destroy$)).subscribe(comment => { this._helperComment = comment; });
  }


  get now(): Date { return new Date(); }

  async ngOnInit() {
    await this.injectionHelperService.fetchHelperCommentTitle(this.coffeInTake, this.sugarInTake, this.kcalInTake);
    await this.injectionHelperService.fetchHelperComment(this.coffeInTake, this.sugarInTake, this.kcalInTake);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
