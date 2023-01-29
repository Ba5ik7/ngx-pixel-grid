import { InjectionToken } from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import { IPixelGridOptions, IPixelGridService, ISize, ITile } from './interfaces/ngx-pixel-grid';
import * as i0 from "@angular/core";
export declare const NGX_PIXEL_GRID_OPTIONS: InjectionToken<IPixelGridOptions>;
export declare class NgxPixelGridService implements IPixelGridService {
    constructor(options: IPixelGridOptions);
    options: IPixelGridOptions;
    buildTilesMatrix(): {
        pixelGrid: PixelGrid;
        tilesMatrix: ITile[][];
    };
    getPixelGridSize(tilesMatrix: ITile[][], gutter: number): ISize;
    mergeTilesMatrix(tilesMatrix: ITile[][], tiles: ITile[]): ITile[][];
    whatTileIsMouseOver(tilesMatrix: ITile[][], rect: DOMRect, event: MouseEvent): ITile | undefined;
    phyllotaxisLayout(tilesMatrix: ITile[][], xOffset?: number, yOffset?: number, iOffset?: number): ITile[][];
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxPixelGridService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxPixelGridService>;
}
//# sourceMappingURL=ngx-pixel-grid.service.d.ts.map