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
      const tileCoordinates = tile.coordinates;
      const { x, y } = tileCoordinates;
      // make a copy of tilesMatrix[x][y]
      const test = `${tilesMatrix[x][y].id}`;
      console.log({
        test,
        shouldBe: `${(x + 10)  * (y + 10)}`,
        tile
      });
      

      const _tile = tilesMatrix[x][y];
      Object.assign(_tile, {
        isPixel: true,
        img: tile.img,
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

  phyllotaxisLayout(tilesMatrix: ITile[][], xOffset = 0, yOffset = 0, iOffset = 0): ITile[][] {
    // theta determines the spiral of the layout
    const theta = Math.PI * (3 - Math.sqrt(5));
    const pointRadius = this.options.tileSize.width / 2;
  
    tilesMatrix.forEach((row, i) => {
      const index = (i + iOffset) % tilesMatrix.length;
      const phylloX = pointRadius * Math.sqrt(index) * Math.cos(index * theta);
      const phylloY = pointRadius * Math.sqrt(index) * Math.sin(index * theta);
      row.forEach(tile => {
        tile.coordinates.x = xOffset + phylloX - pointRadius;
        tile.coordinates.y = yOffset + phylloY - pointRadius;
      });
    });
  
    return tilesMatrix;
  }
}



