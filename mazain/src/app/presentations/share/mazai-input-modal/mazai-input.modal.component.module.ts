import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MazaiImageComponentModule } from "../mazai-image/mazai-image.module";
import { MazaiInputModalComponent } from "./mazai-input-modal.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        MazaiImageComponentModule,
    ], declarations: [
        MazaiInputModalComponent
    ], exports: [
        MazaiInputModalComponent
    ]
})
export class MazaiInputModalComponentModule { }