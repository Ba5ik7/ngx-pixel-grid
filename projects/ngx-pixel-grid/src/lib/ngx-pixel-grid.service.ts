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

  mergeTilesMatrix(tilesMatrix: ITile[][], tiles: ITile[]): ITile[][] {
    tiles.forEach((tile: ITile) => {
      const tileCoordinates = tile.coordinates;
      const y = tileCoordinates.y;
      const x = tileCoordinates.x;  
      tilesMatrix[x][y].isPixel = true;
      tilesMatrix[x][y].img = tile.img;
      tilesMatrix[x][y].color = 'rbg(0, 0, 0)';
      tilesMatrix[x][y].href = tile.href;
      tilesMatrix[x][y].tooltipText = tile.tooltipText;
    });
    return tilesMatrix;
  }
}



