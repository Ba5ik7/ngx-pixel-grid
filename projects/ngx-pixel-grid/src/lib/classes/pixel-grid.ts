import { IPixelGrid, ISize, ITile } from '../interfaces/ngx-pixel-grid';

export class PixelGrid implements IPixelGrid {
  constructor(public rows: number, public columns: number, public gutter: number) { }

  buildTilesMatrix(
    tileSize: ISize,
    tileColor: string,
    tileHoverColor: string,
    tileOnClick: (id: number) => void): ITile[][] {
    const tilesMatrix: ITile[][] = [];
    for (let row = 0; row < this.rows; row++) {
      tilesMatrix[row] = [];
      for (let column = 0; column < this.columns; column++) {
        tilesMatrix[row][column] = {
          id: row * this.columns + column,
          coordinates: {
            x: (tileSize.width + this.gutter) * column,
            y: (tileSize.height + this.gutter) * row
          },
          size: tileSize,
          color: tileColor,
          hoverColor: tileHoverColor,
          onClick: tileOnClick
        };
      }
    }
    return tilesMatrix;
  }
}