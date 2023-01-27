import { IPixelGrid, ISize, ITile } from '../interfaces/ngx-pixel-grid';

export class PixelGrid implements IPixelGrid {
  constructor(public rows: number, public columns: number, public gutter: number) { }

  buildTilesMatrix(tileSize: ISize, tileColor: string, tileOnClick: (id: number) => void, tileOnHover: () => void): ITile[][] {
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