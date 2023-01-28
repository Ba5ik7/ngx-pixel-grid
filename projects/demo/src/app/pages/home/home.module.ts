import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DialogOverviewExampleDialog, HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { NgxPixelGridModule } from 'ngx-pixel-grid';


@NgModule({
  declarations: [
    HomeComponent,
    DialogOverviewExampleDialog
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    NgxPixelGridModule
  ]
})
export class HomeModule { }
