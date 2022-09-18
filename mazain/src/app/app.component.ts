import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from './domain/services/Storage.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ApplicationConst } from './consts/Application.const';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform,
    private storageService: StorageService,
    private iab: InAppBrowser,) {
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.storageService.init();
  }


  /**
   * プライバシーポリシーページに飛ぶ
   */
  onClickPrivacyPolicyBtn() {
    this.iab.create(ApplicationConst.PRVACY_POLICY_URL);
  }

  /**
   * アプリ説明ページに飛ぶ
   */
  onClickAppDescBtn() {
    this.iab.create(ApplicationConst.APP_DESC_PAGE);
  }

}
