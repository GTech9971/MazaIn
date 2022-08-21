import { Component, OnInit } from '@angular/core';
import { StorageService } from './domain/services/Storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storageService: StorageService) {
  }

  async ngOnInit() {
    await this.storageService.init();
  }

}
