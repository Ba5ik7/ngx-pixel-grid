import { Component, HostBinding, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  pixels$ = this.homeService.pixels$
  .pipe(
    map((result) => {
      result.listPixelBlocks.items.forEach((item: any) => {
        item.coordinates = { x: item.i, y: item.j };
      });
      return result.listPixelBlocks.items;
    })
  );


  ngOnInit(): void {
  }

  loadPixels() {
    this.homeService.loadPixels();
  }

}
