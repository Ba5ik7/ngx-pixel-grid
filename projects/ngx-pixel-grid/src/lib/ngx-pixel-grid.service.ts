import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import { IPixelGridOptions, IPixelGridService, ISize, ITile } from './interfaces/ngx-pixel-grid';

export const NGX_PIXEL_GRID_OPTIONS = new InjectionToken<IPixelGridOptions>('NGX_PIXEL_GRID_OPTIONS');
const defaultOptions: IPixelGridOptions = {
  introAnimation: true,
  gutter: 1,
  rows: 100,
  columns: 100,
  tileSize: { width: 10, height: 10 },
  tileColor: 'rgb(140, 140, 140)',
  tileHoverColor: 'rgb(70, 70, 70)'
};

@Injectable({
  providedIn: 'root'
})
export class NgxPixelGridService implements IPixelGridService {

  constructor(@Optional() @Inject(NGX_PIXEL_GRID_OPTIONS) options: IPixelGridOptions) { 
    options && Object.assign(this.options, options);
  }
  options = defaultOptions;

  createCtx(tilesMatrix: ITile[][], canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    const pixelGridSize = 
      this.getPixelGridSize(tilesMatrix, this.options.gutter);
    canvas.width = pixelGridSize.width;
    canvas.height = pixelGridSize.height;
    canvas.style.cursor = 'pointer';
    return ctx;
  }

  buildTilesMatrix(): { pixelGrid: PixelGrid, tilesMatrix: ITile[][] } {
    const {
      columns, rows, gutter,
      tileSize, tileColor, tileHoverColor
  } = this.options
    const pixelGrid = new PixelGrid(columns, rows, gutter);
    const tilesMatrix = pixelGrid.buildTilesMatrix(tileSize, tileColor, tileHoverColor);
    return { pixelGrid, tilesMatrix};
  }

  getPixelGridSize(tilesMatrix: ITile[][], gutter: number): ISize {
    const width = tilesMatrix[0].length * tilesMatrix[0][0].size.width + (tilesMatrix[0].length - 1) * gutter;
    const height = tilesMatrix.length * tilesMatrix[0][0].size.height + (tilesMatrix.length - 1) * gutter;
    return { width, height };
  }

  mergeTilesMatrix(tilesMatrix: ITile[][], tiles: ITile[]): ITile[][] {
    tiles.forEach((tile: ITile) => {
      const img = new Image();
      img.src = tile.base64!;

      const tileCoordinates = tile.coordinates;
      const { x, y } = tileCoordinates;
      const _tile = tilesMatrix[x][y];
      Object.assign(_tile, {
        isPixel: true,
        img,
        color: 'rbg(0, 0, 0)',
        href: tile.href,
        tooltipText: tile.tooltipText
      });
    });
    return tilesMatrix;
  }

  whatTileIsMouseOver(tilesMatrix: ITile[][], rect: DOMRect, event: MouseEvent): ITile | undefined {
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let returnTile: ITile | undefined;
    tilesMatrix.forEach((row) => {
      row.forEach((tile) => {
        if (x >= tile.coordinates.x && x <= tile.coordinates.x + tile.size.width &&
            y >= tile.coordinates.y && y <= tile.coordinates.y + tile.size.height) {
            returnTile = tile;
          }
      });
    });
    return returnTile;
  }

  phyllotaxisLayout(tiles: ITile[], xOffset = 0, yOffset = 0, iOffset = 0): ITile[] {
    // const theta = Math.PI * (6 - Math.sqrt(20));
    // const pointRadius = 7;
    const theta = Math.PI * (3 - Math.sqrt(10));
    const pointRadius = 5;
  
    tiles.forEach((tile, i) => {
        const index = (i + iOffset) % tiles.length;
        const phylloX = pointRadius * Math.sqrt(index) * Math.cos(index * theta);
        const phylloY = pointRadius * Math.sqrt(index) * Math.sin(index * theta);
        tile.coordinates.x = xOffset + phylloX - pointRadius;
        tile.coordinates.y = yOffset + phylloY - pointRadius;
        tile.size.width = 3;
        tile.size.height = 3;
        // tile.color = `hsla(300, ${~~(40 * Math.random() + 60)}%, ${~~(60 * Math.random() + 20)}%, 1)`;
    });
  
    return tiles;
  }

  gridLayout(tiles: ITile[]): ITile[] {
    for (let row = 0; row < this.options.rows; row++) {
      for (let column = 0; column < this.options.columns; column++) {
        const tile = tiles[row * this.options.columns + column];
        tile.coordinates.x = column * (this.options.tileSize.width + this.options.gutter);
        tile.coordinates.y = row * (this.options.tileSize.height + this.options.gutter);
        tile.size.width = 9;
        tile.size.height = 9;
        // tile.color = this.options.tileColor;
      }
    }
    return tiles;
  }
}


function getRandomArbitaryInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}