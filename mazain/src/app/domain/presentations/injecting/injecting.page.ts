import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-injecting',
  templateUrl: './injecting.page.html',
  styleUrls: ['./injecting.page.scss'],
})
export class InjectingPage implements OnInit {

  processValue: number;

  constructor() {
    this.processValue = 0;
  }

  ngOnInit() {
    for (let i = 0; i <= 100; i++) {
      this.setPercentBar(i);
    }
  }

  private setPercentBar(i: number) {
    setTimeout(() => {
      let apc = (i / 100);
      this.processValue = apc;
    }, 30 * i);
  }

}
