import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MazaiInjectionPopoverComponentModule } from "../mazai-injection-popover/mazai-injection-popover.component.module";
import { MazaiThumbnailComponentModule } from "../mazai-thumbnail/mazai-thumbnail.module";
import { MazaiShowcaseComponent } from "./mazai-showcase.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        MazaiThumbnailComponentModule,
        MazaiInjectionPopoverComponentModule,
    ], declarations: [
        MazaiShowcaseComponent,
    ], exports: [
        MazaiShowcaseComponent
    ]
})
export class MazaiShowcaseComponentModule { }