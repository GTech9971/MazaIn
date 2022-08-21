# MazaIn
 魔剤管理アプリ


## iosビルド
プロジェクトフォルダ内で以下のコマンドを実行
- `ionic build --prod`
- `ionic integrations enable capacitor`
- `ionic cap add ios`

Xcodeで開く
- `npx cap open ios`

変更点をXcodeに反映させる
- `ionic build --prod`
- `npx cap copy`

## プラグイン

### ブラウザ表示(InAppBrowser)

https://ionicframework.com/docs/native/in-app-browser

- `npm install cordova-plugin-inappbrowser `
- `npm install @awesome-cordova-plugins/in-app-browser `
- `ionic cap sync`

app.module.tsを以下のように修正
```
import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    InAppBrowser, //ここを追加
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },    
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
```


使用する場合
```
import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private iab: InAppBrowser,) { }

  onClickPrivacyPolicyBtn() {
    this.iab.create('https://ionicframework.com/');
  }
}
```

