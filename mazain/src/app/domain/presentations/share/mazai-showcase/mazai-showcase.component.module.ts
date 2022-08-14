import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MazaiShowcaseComponent } from "./mazai-showcase.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ], declarations: [
        MazaiShowcaseComponent,
    ], exports: [
        MazaiShowcaseComponent
    ]
})
export class MazaiShowcaseComponentModule { }