import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MazaiInjectionPopoverComponent } from "./mazai-injection-popover.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ], declarations: [
        MazaiInjectionPopoverComponent,
    ], exports: [
        MazaiInjectionPopoverComponent
    ]
})
export class MazaiInjectionPopoverComponentModule { }