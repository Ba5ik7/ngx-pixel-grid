import { NgModule } from '@angular/core';
import { NgxPixelCreatorComponent } from './ngx-pixel-creator.component';
import { PixelCanvasComponent } from './pixel-canvas/pixel-canvas.component';



@NgModule({
  declarations: [
    NgxPixelCreatorComponent,
    PixelCanvasComponent
  ],
  imports: [
  ],
  exports: [
    NgxPixelCreatorComponent
  ]
})
export class NgxPixelCreatorModule { }
