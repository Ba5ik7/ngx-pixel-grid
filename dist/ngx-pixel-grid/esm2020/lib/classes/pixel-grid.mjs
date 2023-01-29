import { Tile } from './tile';
export class PixelGrid {
    constructor(rows, columns, gutter) {
        this.rows = rows;
        this.columns = columns;
        this.gutter = gutter;
    }
    buildTilesMatrix(tileSize, tileColor, tileHoverColor) {
        const tilesMatrix = [];
        for (let row = 0; row < this.rows; row++) {
            tilesMatrix[row] = [];
            for (let column = 0; column < this.columns; column++) {
                tilesMatrix[row][column] = new Tile((row * this.columns + column).toString(), false, {
                    x: (tileSize.width + this.gutter) * column,
                    y: (tileSize.height + this.gutter) * row
                }, tileSize, tileColor, tileHoverColor, `Tile ${row * this.columns + column}`);
            }
        }
        return tilesMatrix;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1waXhlbC1ncmlkL3NyYy9saWIvY2xhc3Nlcy9waXhlbC1ncmlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFOUIsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFBbUIsSUFBWSxFQUFTLE9BQWUsRUFBUyxNQUFjO1FBQTNELFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFJLENBQUM7SUFFbkYsZ0JBQWdCLENBQ2QsUUFBZSxFQUNmLFNBQWlCLEVBQ2pCLGNBQXNCO1FBRXRCLE1BQU0sV0FBVyxHQUFjLEVBQUUsQ0FBQztRQUNsQyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLEtBQUssSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUNwRCxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQ2pDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQ3hDLEtBQUssRUFDTDtvQkFDRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNO29CQUMxQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHO2lCQUN6QyxFQUNELFFBQVEsRUFDUixTQUFTLEVBQ1QsY0FBYyxFQUNkLFFBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQ3RDLENBQUM7YUFDSDtTQUNGO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVBpeGVsR3JpZCwgSVNpemUsIElUaWxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9uZ3gtcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSAnLi90aWxlJztcblxuZXhwb3J0IGNsYXNzIFBpeGVsR3JpZCBpbXBsZW1lbnRzIElQaXhlbEdyaWQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm93czogbnVtYmVyLCBwdWJsaWMgY29sdW1uczogbnVtYmVyLCBwdWJsaWMgZ3V0dGVyOiBudW1iZXIpIHsgfVxuXG4gIGJ1aWxkVGlsZXNNYXRyaXgoXG4gICAgdGlsZVNpemU6IElTaXplLFxuICAgIHRpbGVDb2xvcjogc3RyaW5nLFxuICAgIHRpbGVIb3ZlckNvbG9yOiBzdHJpbmcsXG4gICk6IElUaWxlW11bXSB7XG4gICAgY29uc3QgdGlsZXNNYXRyaXg6IElUaWxlW11bXSA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIHRpbGVzTWF0cml4W3Jvd10gPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMuY29sdW1uczsgY29sdW1uKyspIHtcbiAgICAgICAgdGlsZXNNYXRyaXhbcm93XVtjb2x1bW5dID0gbmV3IFRpbGUoXG4gICAgICAgICAgKHJvdyAqIHRoaXMuY29sdW1ucyArIGNvbHVtbikudG9TdHJpbmcoKSxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4OiAodGlsZVNpemUud2lkdGggKyB0aGlzLmd1dHRlcikgKiBjb2x1bW4sXG4gICAgICAgICAgICB5OiAodGlsZVNpemUuaGVpZ2h0ICsgdGhpcy5ndXR0ZXIpICogcm93XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aWxlU2l6ZSxcbiAgICAgICAgICB0aWxlQ29sb3IsXG4gICAgICAgICAgdGlsZUhvdmVyQ29sb3IsXG4gICAgICAgICAgYFRpbGUgJHtyb3cgKiB0aGlzLmNvbHVtbnMgKyBjb2x1bW59YFxuICAgICAgICApOyAgICAgICAgXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aWxlc01hdHJpeDtcbiAgfVxufVxuIl19