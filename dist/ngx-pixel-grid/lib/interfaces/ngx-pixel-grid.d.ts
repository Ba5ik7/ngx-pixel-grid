export declare type RGB = `rgb(${number}, ${number}, ${number})`;
export declare type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export declare type HEX = `#${string}`;
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
    gutter: number;
    rows: number;
    columns: number;
}
export interface ITile {
    id: string;
    isPixel: boolean;
    coordinates: ICoordinates;
    size: ISize;
    color: string;
    hoverColor: string;
    tooltipText?: string;
    img?: string;
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
