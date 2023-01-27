import { ICoordinates, ISize } from '../interfaces/ngx-pixel-grid';

export class Tile {
  constructor(
    public coordinates: ICoordinates,
    public size: ISize,
    public color: string,
    public onClick: (id: number) => void,
    public onHover: () => void
  ) { }
}