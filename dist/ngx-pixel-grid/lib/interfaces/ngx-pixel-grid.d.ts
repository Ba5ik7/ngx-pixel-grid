export declare type RGB = `rgb(${number}, ${number}, ${number})`;
export declare type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export declare type HEX = `#${string}`;
export interface IPixelGridService {
    options: IPixelGridOptions;
}
export interface IPixelGridOptions {
    introAnimation: boolean;
    gutter: number;
    rows: number;
    columns: number;
    tileSize: ISize;
    tileColor: RGB | RGBA | HEX;
    tileHoverColor: RGB | RGBA | HEX;
}
export interface IPixelGrid {
    tiles?: ITile[];
    gutter: number;
    rows: number;
    columns: number;
}
export interface ITile {
    id: string;
    isPixel: boolean;
    coordinates: ICoordinates;
    sourceCoordinates: ICoordinates;
    targetCoordinates: ICoordinates;
    size: ISize;
    color: string;
    hoverColor: string;
    tooltipText?: string;
    img?: CanvasImageSource;
    base64?: string;
    href?: string;
}
export interface ICoordinates {
    x: number;
    y: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface ITileClickEvent {
    id: string;
    href?: string;
}
//# sourceMappingURL=ngx-pixel-grid.d.ts.map