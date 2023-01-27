import { ICoordinates, ISize, ITile } from '../interfaces/ngx-pixel-grid';

export class Tile implements ITile {
  constructor(
    public id: number,
    public coordinates: ICoordinates,
    public size: ISize,
    public color: string,
    public onClick: (id: number) => void,
    public onHover: () => void
  ) { }
}