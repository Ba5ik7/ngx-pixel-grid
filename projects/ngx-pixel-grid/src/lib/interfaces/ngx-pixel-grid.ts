// Make a interface for the options of the pixel grid
// This interface will be used in the constructor of the PixelGrid class
// add a option for an intro anmation
// add a option for the gutter
// add a option for the rows
// add a option for the columns

export interface IPixelGridOptions {
  introAnimation: boolean;
  gutter: number;
  rows: number;
  columns: number;
}

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