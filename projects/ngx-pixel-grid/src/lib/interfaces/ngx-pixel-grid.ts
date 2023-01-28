export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;

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
// Create a interface for the width and height of a tile
export interface ISize {
  width: number;
  height: number;
}
