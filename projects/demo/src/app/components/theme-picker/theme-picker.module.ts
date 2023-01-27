import { NgModule, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';


import { ThemePickerComponent } from './theme-picker.component';
import { ThemePickerService } from './theme-picker.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [ThemePickerComponent],
  exports: [ThemePickerComponent],
  providers: [ThemePickerService]
})
export class ThemePickerModule { }
