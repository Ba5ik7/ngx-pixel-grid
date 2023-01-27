import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  ViewChild
} from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import { ISize, ITile } from './interfaces/ngx-pixel-grid';

@Component({
  selector: 'ngx-pixel-grid',
  template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`,
  styles: ['.pixel-grid-canvas-container { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxPixelGridComponent implements AfterViewInit {

  constructor(private ngZone: NgZone) { }

  @ViewChild('pixelGridCanvasContatiner') pixelGridCanvasContatiner!: ElementRef<HTMLDivElement>;
  @ViewChild('pixelGridCanvas') pixelGridCanvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  pixelGrid!: PixelGrid;
  pixelGridTilesMatrix!: ITile[][];

  @HostListener('window:resize')
  onResize() {
    const pixelGridSize = this.getPixelGridSize(this.pixelGridTilesMatrix, this.pixelGrid.gutter);
    this.pixelGridCanvas.nativeElement.width = pixelGridSize.width
    this.pixelGridCanvas.nativeElement.height = pixelGridSize.height;
  }

  ngAfterViewInit(): void {
    this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d')!;

    this.pixelGridCanvasContatiner.nativeElement.style.cursor = 'pointer';
    this.pixelGridCanvas.nativeElement.addEventListener('click', this.handleMouseClick);
    this.pixelGridCanvas.nativeElement.addEventListener('mousemove', this.handleMouseMove);

    this.pixelGrid = new PixelGrid(100, 100, 1);
    this.pixelGridTilesMatrix = this.pixelGrid.buildTilesMatrix(
      { width: 10, height: 10 },
      'red',
      'blue',
      (id: number) => console.log(id)
    );

    this.onResize();
    this.ngZone.runOutsideAngular(() => this.loop());
  }
  
  loop() {
    this.pixelGridTilesMatrix.forEach(row => {
      row.forEach(tile => {
        this.ctx.fillStyle = tile.color;
        this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
      });
    });
    requestAnimationFrame(() => this.loop());
  }

  getPixelGridSize(pixelGridTilesMatrix: ITile[][], gutter: number): ISize {
    const width = pixelGridTilesMatrix[0].length * pixelGridTilesMatrix[0][0].size.width + (pixelGridTilesMatrix[0].length - 1) * gutter;
    const height = pixelGridTilesMatrix.length * pixelGridTilesMatrix[0][0].size.height + (pixelGridTilesMatrix.length - 1) * gutter;
    return { width, height };
  }

  whatTileIsMouseOver(event: MouseEvent): ITile | undefined {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let returnTile = undefined;
    for(let i = 0; i < this.pixelGridTilesMatrix.length; i++) {
      for(let j = 0; j < this.pixelGridTilesMatrix[i].length; j++) {
        const tile = this.pixelGridTilesMatrix[i][j];
        if (x >= tile.coordinates.x && x <= tile.coordinates.x + tile.size.width &&
          y >= tile.coordinates.y && y <= tile.coordinates.y + tile.size.height) {
            returnTile = tile;
          }
      }
    }
    return returnTile;
  }

  handleMouseClick = (event: MouseEvent) => {
    const tile = this.whatTileIsMouseOver(event);
    if (tile) tile.onClick(tile.id);
  }


  currentTileBeingHovered: ITile | undefined;
  handleMouseMove = (event: MouseEvent) => {
    const tile = this.whatTileIsMouseOver(event);
    if (tile) {
      // If the tile is the same as the one being hovered, do nothing
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id) return;
      // If there is a tile being hovered, reset its color
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
        this.currentTileBeingHovered.color = tile.color;
      }
      // Set the new tile being hovered
      this.currentTileBeingHovered = tile;
      this.currentTileBeingHovered.color = tile.hoverColor;
    }
  }
}
