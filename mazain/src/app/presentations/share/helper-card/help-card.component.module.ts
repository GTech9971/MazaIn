import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
//import { SwiperModule } from "swiper/angular";
import { HelperCardComponent } from "./helper-card.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        //  SwiperModule,
    ], declarations: [HelperCardComponent],
    exports: [HelperCardComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelperCardComponentModule { }