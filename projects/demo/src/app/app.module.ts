import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NavbarModule } from './components/navbar/navbar.module';
import { HttpClientModule } from '@angular/common/http';
import { NGX_PIXEL_GRID_OPTIONS } from 'ngx-pixel-grid';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    NavbarModule
  ],
  providers: [
    {
      provide: NGX_PIXEL_GRID_OPTIONS,
      useValue: {
        introAnimation: true,
        gutter: 1,
        rows: 100,
        columns: 100,
        tileSize: {
          width: 9,
          height: 9
        },
        tileColor: 'rgba(140, 140, 140, 1)',
        tileHoverColor: 'rgba(210, 210, 210, 1)'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
