import {
  AfterViewInit,
  Component,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'ngx-pixel-grid',
  template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`,
  styles: ['.pixel-grid-canvas-container { width: 100%; height: 100%; }']
})
export class NgxPixelGridComponent implements AfterViewInit {

  @ViewChild('pixelGridCanvasContatiner') pixelGridCanvasContatiner!: HTMLDivElement;
  @ViewChild('pixelGridCanvas') pixelGridCanvas!: HTMLCanvasElement;

  constructor() { }

  ngAfterViewInit(): void {

  }
}
