export interface IPixelGrid {
  gutter: number;
  rows: number;
  columns: number;
}

export interface ITile {
  id: number;
  coordinates: ICoordinates;
  size: ISize;
  color: string;
  hoverColor: string;
  onClick: (id: number) => void;
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