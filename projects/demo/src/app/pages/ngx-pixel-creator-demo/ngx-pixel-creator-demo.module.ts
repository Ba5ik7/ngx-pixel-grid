import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPixelCreatorDemoRoutingModule } from './ngx-pixel-creator-demo-routing.module';
import { NgxPixelCreatorDemoComponent } from './ngx-pixel-creator-demo.component';
import { NgxPixelCreatorModule } from 'ngx-pixel-creator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    NgxPixelCreatorDemoComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    NgxPixelCreatorDemoRoutingModule,
    NgxPixelCreatorModule
  ]
})
export class NgxPixelCreatorDemoModule { }
