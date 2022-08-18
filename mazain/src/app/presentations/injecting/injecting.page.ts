import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-injecting',
  templateUrl: './injecting.page.html',
  styleUrls: ['./injecting.page.scss'],
})
export class InjectingPage implements OnInit {

  processValue: number;

  constructor(private router: Router) {
    this.processValue = 0;
  }

  async ngOnInit() {
    for (let i = 0; i <= 100; i++) {
      await this.setPercentBar(i);
    }
    await this.router.navigate(['tab/detail']);
  }

  private async setPercentBar(i: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let apc = (i / 100);
        this.processValue = apc;
        resolve();
      }, i);
    });
  }

}
