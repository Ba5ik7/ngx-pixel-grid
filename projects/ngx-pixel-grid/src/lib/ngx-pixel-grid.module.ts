import { NgModule } from '@angular/core';
import { NgxPixelGridComponent } from './ngx-pixel-grid.component';
import { TooltipComponent } from './tooltip/tooltip.component';



@NgModule({
  declarations: [
    NgxPixelGridComponent,
    TooltipComponent
  ],
  imports: [
  ],
  exports: [
    NgxPixelGridComponent
  ]
})
export class NgxPixelGridModule { }
