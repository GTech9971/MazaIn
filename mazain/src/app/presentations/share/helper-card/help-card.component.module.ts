import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HelperCardComponent } from "./helper-card.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ], declarations: [HelperCardComponent],
    exports: [HelperCardComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelperCardComponentModule { }