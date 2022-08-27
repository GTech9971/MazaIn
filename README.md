# MazaIn
 魔剤管理アプリ
 魔剤の注入数、エナジー接種状況などを管理する

# 開発環境
- Mac mini(M1,2020), MacBookAir(M1,2020)
- macOS Monterey 12.5.1
- Xcode 12.0
- nodejs 16.14.0
- angular@14.0.0
- ionic/cli@6.19.1
- capacitor@4.1.0

## homebrewインストール
- `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` 

## Xcodeライブラリインストール
- `xcode-select --install`
- `brew install cocoapods`

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

## プラグイン(capacitor)


### [アイコン](https://capacitorjs.com/docs/guides/splash-screens-and-icons)
以下のプラグインをインストール

- `sudo npm install -g cordova-res`

- アプリのrootフォルダに`resources`フォルダを作成
- `icon.png`ファイルを配置 [アルファチャネルは削除する](http://blog.be-style.jpn.com/article/105597923.html)
- `cordova-res ios --skip-config --copy --type icon` (※アイコンだけの場合、--type iconを入れないとエラーが発生し、ネイティブフォルダに画像が反映されない)


### [ブラウザ表示(InAppBrowser)](https://ionicframework.com/docs/native/in-app-browser)

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

