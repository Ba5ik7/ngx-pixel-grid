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
                tilesMatrix[row][column] = {
                    id: (row * this.columns + column).toString(),
                    isPixel: false,
                    coordinates: {
                        x: (tileSize.width + this.gutter) * column,
                        y: (tileSize.height + this.gutter) * row
                    },
                    size: tileSize,
                    color: tileColor,
                    hoverColor: tileHoverColor,
                    tooltipText: `Tile ${row * this.columns + column}`
                };
            }
        }
        return tilesMatrix;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1waXhlbC1ncmlkL3NyYy9saWIvY2xhc3Nlcy9waXhlbC1ncmlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxTQUFTO0lBQ3BCLFlBQW1CLElBQVksRUFBUyxPQUFlLEVBQVMsTUFBYztRQUEzRCxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBSSxDQUFDO0lBRW5GLGdCQUFnQixDQUNkLFFBQWUsRUFDZixTQUFpQixFQUNqQixjQUFzQjtRQUV0QixNQUFNLFdBQVcsR0FBYyxFQUFFLENBQUM7UUFDbEMsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDeEMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN0QixLQUFLLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDcEQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHO29CQUN6QixFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUU7b0JBQzVDLE9BQU8sRUFBRSxLQUFLO29CQUNkLFdBQVcsRUFBRTt3QkFDWCxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNO3dCQUMxQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHO3FCQUN6QztvQkFDRCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsU0FBUztvQkFDaEIsVUFBVSxFQUFFLGNBQWM7b0JBQzFCLFdBQVcsRUFBRSxRQUFRLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sRUFBRTtpQkFDbkQsQ0FBQzthQUNIO1NBQ0Y7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUGl4ZWxHcmlkLCBJU2l6ZSwgSVRpbGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcblxuZXhwb3J0IGNsYXNzIFBpeGVsR3JpZCBpbXBsZW1lbnRzIElQaXhlbEdyaWQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm93czogbnVtYmVyLCBwdWJsaWMgY29sdW1uczogbnVtYmVyLCBwdWJsaWMgZ3V0dGVyOiBudW1iZXIpIHsgfVxuXG4gIGJ1aWxkVGlsZXNNYXRyaXgoXG4gICAgdGlsZVNpemU6IElTaXplLFxuICAgIHRpbGVDb2xvcjogc3RyaW5nLFxuICAgIHRpbGVIb3ZlckNvbG9yOiBzdHJpbmcsXG4gICk6IElUaWxlW11bXSB7XG4gICAgY29uc3QgdGlsZXNNYXRyaXg6IElUaWxlW11bXSA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIHRpbGVzTWF0cml4W3Jvd10gPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMuY29sdW1uczsgY29sdW1uKyspIHtcbiAgICAgICAgdGlsZXNNYXRyaXhbcm93XVtjb2x1bW5dID0ge1xuICAgICAgICAgIGlkOiAocm93ICogdGhpcy5jb2x1bW5zICsgY29sdW1uKS50b1N0cmluZygpLFxuICAgICAgICAgIGlzUGl4ZWw6IGZhbHNlLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiB7XG4gICAgICAgICAgICB4OiAodGlsZVNpemUud2lkdGggKyB0aGlzLmd1dHRlcikgKiBjb2x1bW4sXG4gICAgICAgICAgICB5OiAodGlsZVNpemUuaGVpZ2h0ICsgdGhpcy5ndXR0ZXIpICogcm93XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaXplOiB0aWxlU2l6ZSxcbiAgICAgICAgICBjb2xvcjogdGlsZUNvbG9yLFxuICAgICAgICAgIGhvdmVyQ29sb3I6IHRpbGVIb3ZlckNvbG9yLFxuICAgICAgICAgIHRvb2x0aXBUZXh0OiBgVGlsZSAke3JvdyAqIHRoaXMuY29sdW1ucyArIGNvbHVtbn1gXG4gICAgICAgIH07ICAgICAgICBcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRpbGVzTWF0cml4O1xuICB9XG59XG4iXX0=