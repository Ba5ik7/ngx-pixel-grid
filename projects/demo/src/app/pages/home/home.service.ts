import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { a } from './dummy-data/a';
import { b } from './dummy-data/b';
import { c } from './dummy-data/c';
import { d } from './dummy-data/d';

const dummyDataLoads = [a, b, c, d];
@Injectable({
  providedIn: 'root'
})
export class HomeService {
 
  private pixels = new Subject<any>();
  public pixels$ = this.pixels.asObservable();

  loadPixels() {
    dummyDataLoads.forEach((data, index) => {
      setTimeout(() => this.pixels.next(data), 1000 * index);
    });
  }
}
