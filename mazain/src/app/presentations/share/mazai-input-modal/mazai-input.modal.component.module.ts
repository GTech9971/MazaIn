import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MazaiInputModalComponent } from "./mazai-input-modal.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule
    ], declarations: [
        MazaiInputModalComponent
    ], exports: [
        MazaiInputModalComponent
    ]
})
export class MazaiInputModalComponentModule { }