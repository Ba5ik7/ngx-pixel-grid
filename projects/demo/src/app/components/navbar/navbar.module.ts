import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { ThemePickerModule } from '../theme-picker/theme-picker.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ThemePickerModule,
    MatButtonModule,
    MatIconModule,
    AppRoutingModule
  ],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule { }
