export interface IPixelGrid {
  gutter: number;
  rows: number;
  columns: number;
}

export interface ITile {
  coordinates: ICoordinates;
  size: ISize;
  color: string;
  onClick: (id: number) => void;
  onHover: () => void;
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