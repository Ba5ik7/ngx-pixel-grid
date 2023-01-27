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
  pixelGrid!: PixelGrid;
  pixelGridTilesMatrix!: ITile[][];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event | null) {
    const pixelGridSize = this.getPixelGridSize(this.pixelGridTilesMatrix, this.pixelGrid.gutter);
    console.log(pixelGridSize);
    
    this.pixelGridCanvas.nativeElement.width = pixelGridSize.width
    this.pixelGridCanvas.nativeElement.height = pixelGridSize.height;
  }

  ngAfterViewInit(): void {
    this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d')!;

    this.pixelGrid = new PixelGrid(100, 100, 1);
    this.pixelGridTilesMatrix = this.pixelGrid.buildTilesMatrix(
      { width: 10, height: 10 },
      'red',
      () => console.log('click'),
      () => console.log('hover')
    );

    // Hate void methods
    this.onResize(null);
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
}

// Create a interface for x and y coordinates
export interface ICoordinates {
  x: number;
  y: number;
}
// Create a interface for the width and height of a tile
export interface ISize {
  width: number;
  height: number;
}
export interface ITile {
  coordinates: ICoordinates;
  size: ISize;
  color: string;
  onClick: () => void;
  onHover: () => void;
}
// Create a class for the tiles in the grid
export class Tile {
  constructor(
    public coordinates: ICoordinates,
    public size: ISize,
    public color: string,
    public onClick: () => void,
    public onHover: () => void
  ) { }
}

// Create a interface for the grid
export interface IGrid {
  gutter: number;
  rows: number;
  columns: number;
}
// Create a class for the grid
// This class will be used to create the grid and to build the tiles matrix
// Write this logic to be declarative
export class PixelGrid {
  constructor(public rows: number, public columns: number, public gutter: number) { }

  // Create a method to build the tiles matrix
  buildTilesMatrix(tileSize: ISize, tileColor: string, tileOnClick: () => void, tileOnHover: () => void): ITile[][] {
    const tilesMatrix: ITile[][] = [];
    for (let row = 0; row < this.rows; row++) {
      tilesMatrix[row] = [];
      for (let column = 0; column < this.columns; column++) {
        tilesMatrix[row][column] = {
          // Add the gutter to the coordinates
          coordinates: {
            x: (tileSize.width + this.gutter) * column,
            y: (tileSize.height + this.gutter) * row
          },
          size: tileSize,
          color: tileColor,
          onClick: tileOnClick,
          onHover: tileOnHover
        };
      }
    }
    return tilesMatrix;
  }
}
