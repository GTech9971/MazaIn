import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from './domain/services/Storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform,
    private storageService: StorageService) {
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.storageService.init();
  }


  /**
   * プライバシーポリシーページに飛ぶ
   */
  onClickPrivacyPolicyBtn() {

  }

}
