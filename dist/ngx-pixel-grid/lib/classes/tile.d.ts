import { ICoordinates, ISize, ITile } from '../interfaces/ngx-pixel-grid';
export declare class Tile implements ITile {
    id: string;
    isPixel: boolean;
    coordinates: ICoordinates;
    size: ISize;
    color: string;
    hoverColor: string;
    tooltipText: string;
    constructor(id: string, isPixel: boolean, coordinates: ICoordinates, size: ISize, color: string, hoverColor: string, tooltipText: string);
}
//# sourceMappingURL=tile.d.ts.map