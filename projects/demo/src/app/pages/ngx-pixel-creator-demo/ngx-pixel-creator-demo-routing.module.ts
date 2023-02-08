import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPixelCreatorDemoComponent } from './ngx-pixel-creator-demo.component';

const routes: Routes = [{ path: '', component: NgxPixelCreatorDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgxPixelCreatorDemoRoutingModule { }
