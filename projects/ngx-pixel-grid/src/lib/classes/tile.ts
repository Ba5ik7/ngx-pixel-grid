import { ICoordinates, ISize, ITile } from '../interfaces/ngx-pixel-grid';

export class Tile implements ITile {
  constructor(
    public id: string,
    public isPixel: boolean,
    public coordinates: ICoordinates,
    public size: ISize,
    public color: string,
    public hoverColor: string,
    public tooltipText: string,
  ) { }
}