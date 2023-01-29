import { InjectionToken } from '@angular/core';
import { HEX, IPixelGridOptions, ISize, ITile, RGB, RGBA } from './interfaces/ngx-pixel-grid';
import * as i0 from "@angular/core";
export declare const NGX_PIXEL_GRID_OPTIONS: InjectionToken<IPixelGridOptions>;
export declare class NgxPixelGridService implements IPixelGridOptions {
    constructor(options: IPixelGridOptions);
    introAnimation: boolean;
    rows: number;
    columns: number;
    gutter: number;
    tileSize: ISize;
    tileColor: RGB | RGBA | HEX;
    tileHoverColor: RGB | RGBA | HEX;
    getPixelGridSize(tilesMatrix: ITile[][], gutter: number): ISize;
    mergeTilesMatrix(tilesMatrix: ITile[][], tiles: ITile[]): ITile[][];
    phyllotaxisLayout(tilesMatrix: ITile[][], xOffset?: number, yOffset?: number, iOffset?: number): ITile[][];
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxPixelGridService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxPixelGridService>;
}
//# sourceMappingURL=ngx-pixel-grid.service.d.ts.map