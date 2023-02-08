import { IPixelGrid, ISize, ITile } from '../interfaces/ngx-pixel-grid';
export declare class PixelGrid implements IPixelGrid {
    rows: number;
    columns: number;
    gutter: number;
    tiles: ITile[];
    constructor(rows: number, columns: number, gutter: number);
    buildTilesMatrix(tileSize: ISize, tileColor: string, tileHoverColor: string): ITile[][];
}
