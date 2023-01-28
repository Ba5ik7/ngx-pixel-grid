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
      const tileRow = Math.floor(tileCoordinates.y / (this.tileSize.height + this.gutter));
      const tileColumn = Math.floor(tileCoordinates.x / (this.tileSize.width + this.gutter));
      
      tilesMatrix[tileRow][tileColumn].isPixel = true;
      tilesMatrix[tileRow][tileColumn].img = tile.img;
      tilesMatrix[tileRow][tileColumn].color = 'rbg(0, 0, 0)';
      tilesMatrix[tileRow][tileColumn].href = tile.href;
      tilesMatrix[tileRow][tileColumn].tooltipText = tile.tooltipText;
      console.log(tilesMatrix[tileRow][tileColumn]);
    });
    return tilesMatrix;
  }
}



