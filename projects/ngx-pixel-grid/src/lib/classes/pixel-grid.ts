import { IPixelGrid, ISize, ITile } from '../interfaces/ngx-pixel-grid';
import { Tile } from './tile';

export class PixelGrid implements IPixelGrid {

  tiles: ITile[] = [];
  constructor(public rows: number, public columns: number, public gutter: number) { }

  buildTilesMatrix(
    tileSize: ISize,
    tileColor: string,
    tileHoverColor: string,
  ): ITile[][] {
    const tilesMatrix: ITile[][] = [];
    for (let row = 0; row < this.rows; row++) {
      tilesMatrix[row] = [];
      for (let column = 0; column < this.columns; column++) {
        tilesMatrix[row][column] = new Tile(
          (row * this.columns + column).toString(),
          false,
          {
            x: (tileSize.width + this.gutter) * column,
            y: (tileSize.height + this.gutter) * row
          },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          tileSize,
          tileColor,
          tileHoverColor,
          `Tile ${row * this.columns + column}`,
        );
        this.tiles.push(tilesMatrix[row][column]);      
      }
    }
    return tilesMatrix;
  }
}
