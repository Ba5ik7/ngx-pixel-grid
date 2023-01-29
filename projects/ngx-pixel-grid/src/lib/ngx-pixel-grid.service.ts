import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HEX, IPixelGridOptions, ISize, ITile, RGB, RGBA } from './interfaces/ngx-pixel-grid';

export const NGX_PIXEL_GRID_OPTIONS = new InjectionToken<IPixelGridOptions>('NGX_PIXEL_GRID_OPTIONS');
@Injectable({
  providedIn: 'root'
})
export class NgxPixelGridService implements IPixelGridOptions {

  constructor(@Optional() @Inject(NGX_PIXEL_GRID_OPTIONS) options: IPixelGridOptions) { 
    if (options) {
      this.introAnimation = options.introAnimation;
      this.rows = options.rows;
      this.columns = options.columns;
      this.gutter = options.gutter;
      this.tileSize = options.tileSize;
      this.tileColor = options.tileColor;
      this.tileHoverColor = options.tileHoverColor;
    }
  }

  introAnimation: boolean = true;
  rows = 100;
  columns = 100;
  gutter = 1;
  tileSize: ISize = { width: 10, height: 10 };
  tileColor: RGB | RGBA | HEX = 'rgb(255, 255, 255)';
  tileHoverColor: RGB | RGBA | HEX = 'rgb(0, 0, 0)';

  getPixelGridSize(tilesMatrix: ITile[][], gutter: number): ISize {
    const width = tilesMatrix[0].length * tilesMatrix[0][0].size.width + (tilesMatrix[0].length - 1) * gutter;
    const height = tilesMatrix.length * tilesMatrix[0][0].size.height + (tilesMatrix.length - 1) * gutter;
    return { width, height };
  }

  mergeTilesMatrix(tilesMatrix: ITile[][], tiles: ITile[]): ITile[][] {
    tiles.forEach((tile: ITile) => {
      const tileCoordinates = tile.coordinates;
      const { x, y } = tileCoordinates;
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
    const pointRadius = this.tileSize.width / 2;
  
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



