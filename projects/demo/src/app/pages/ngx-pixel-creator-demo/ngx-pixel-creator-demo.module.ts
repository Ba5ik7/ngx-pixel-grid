import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPixelCreatorDemoRoutingModule } from './ngx-pixel-creator-demo-routing.module';
import { NgxPixelCreatorDemoComponent } from './ngx-pixel-creator-demo.component';
import { NgxPixelCreatorModule } from 'ngx-pixel-creator';


@NgModule({
  declarations: [
    NgxPixelCreatorDemoComponent
  ],
  imports: [
    CommonModule,
    NgxPixelCreatorDemoRoutingModule,
    NgxPixelCreatorModule
  ]
})
export class NgxPixelCreatorDemoModule { }
