import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HelperCardComponent } from "./helper-card.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ], declarations: [HelperCardComponent],
    exports: [HelperCardComponent]
})
export class HelperCardComponentModule { }