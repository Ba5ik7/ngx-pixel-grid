import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
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

  constructor(private ngZone: NgZone) { }

  @ViewChild('pixelGridCanvasContatiner') pixelGridCanvasContatiner!: ElementRef<HTMLDivElement>;
  @ViewChild('pixelGridCanvas') pixelGridCanvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event | null) {
    this.pixelGridCanvas.nativeElement.width = this.pixelGridCanvasContatiner.nativeElement.clientWidth;
    this.pixelGridCanvas.nativeElement.height = this.pixelGridCanvasContatiner.nativeElement.clientHeight;
  }

  ngAfterViewInit(): void {
    this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d')!;
    this.onResize(null);

    this.ngZone.runOutsideAngular(() => this.loop());
  }
  
  loop() {

    requestAnimationFrame(() => this.loop());
  }
}
