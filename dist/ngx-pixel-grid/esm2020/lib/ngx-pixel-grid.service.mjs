import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import * as i0 from "@angular/core";
export const NGX_PIXEL_GRID_OPTIONS = new InjectionToken('NGX_PIXEL_GRID_OPTIONS');
const defaultOptions = {
    introAnimation: true,
    gutter: 1,
    rows: 100,
    columns: 100,
    tileSize: { width: 10, height: 10 },
    tileColor: 'rgb(140, 140, 140)',
    tileHoverColor: 'rgb(70, 70, 70)'
};
export class NgxPixelGridService {
    constructor(options) {
        this.options = defaultOptions;
        options && Object.assign(this.options, options);
    }
    createCtx(tilesMatrix, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const pixelGridSize = this.getPixelGridSize(tilesMatrix, this.options.gutter);
        canvas.width = pixelGridSize.width;
        canvas.height = pixelGridSize.height;
        canvas.style.cursor = 'pointer';
        return ctx;
    }
    buildTilesMatrix() {
        const { columns, rows, gutter, tileSize, tileColor, tileHoverColor } = this.options;
        const pixelGrid = new PixelGrid(columns, rows, gutter);
        const tilesMatrix = pixelGrid.buildTilesMatrix(tileSize, tileColor, tileHoverColor);
        return { pixelGrid, tilesMatrix };
    }
    getPixelGridSize(tilesMatrix, gutter) {
        const width = tilesMatrix[0].length * tilesMatrix[0][0].size.width + (tilesMatrix[0].length - 1) * gutter;
        const height = tilesMatrix.length * tilesMatrix[0][0].size.height + (tilesMatrix.length - 1) * gutter;
        return { width, height };
    }
    mergeTilesMatrix(tilesMatrix, tiles) {
        tiles.forEach((tile) => {
            const img = new Image();
            img.src = tile.base64;
            const tileCoordinates = tile.coordinates;
            const { x, y } = tileCoordinates;
            const _tile = tilesMatrix[x][y];
            Object.assign(_tile, {
                isPixel: true,
                img,
                color: 'rbg(0, 0, 0)',
                href: tile.href,
                tooltipText: tile.tooltipText
            });
        });
        return tilesMatrix;
    }
    whatTileIsMouseOver(tilesMatrix, rect, event) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let returnTile;
        tilesMatrix.forEach((row) => {
            row.forEach((tile) => {
                if (x >= tile.coordinates.x && x <= tile.coordinates.x + tile.size.width &&
                    y >= tile.coordinates.y && y <= tile.coordinates.y + tile.size.height) {
                    returnTile = tile;
                }
            });
        });
        return returnTile;
    }
    phyllotaxisLayout(tiles, xOffset = 0, yOffset = 0, iOffset = 0) {
        // const theta = Math.PI * (6 - Math.sqrt(20));
        // const pointRadius = 7;
        const theta = Math.PI * (3 - Math.sqrt(10));
        const pointRadius = 5;
        tiles.forEach((tile, i) => {
            const index = (i + iOffset) % tiles.length;
            const phylloX = pointRadius * Math.sqrt(index) * Math.cos(index * theta);
            const phylloY = pointRadius * Math.sqrt(index) * Math.sin(index * theta);
            tile.coordinates.x = xOffset + phylloX - pointRadius;
            tile.coordinates.y = yOffset + phylloY - pointRadius;
            tile.size.width = 3;
            tile.size.height = 3;
            // tile.color = `hsla(300, ${~~(40 * Math.random() + 60)}%, ${~~(60 * Math.random() + 20)}%, 1)`;
        });
        return tiles;
    }
    gridLayout(tiles) {
        for (let row = 0; row < this.options.rows; row++) {
            for (let column = 0; column < this.options.columns; column++) {
                const tile = tiles[row * this.options.columns + column];
                tile.coordinates.x = column * (this.options.tileSize.width + this.options.gutter);
                tile.coordinates.y = row * (this.options.tileSize.height + this.options.gutter);
                tile.size.width = 9;
                tile.size.height = 9;
                // tile.color = this.options.tileColor;
            }
        }
        return tiles;
    }
}
NgxPixelGridService.ɵfac = function NgxPixelGridService_Factory(t) { return new (t || NgxPixelGridService)(i0.ɵɵinject(NGX_PIXEL_GRID_OPTIONS, 8)); };
NgxPixelGridService.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NgxPixelGridService, factory: NgxPixelGridService.ɵfac, providedIn: 'root' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelGridService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NGX_PIXEL_GRID_OPTIONS]
            }] }]; }, null); })();
function getRandomArbitaryInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1waXhlbC1ncmlkL3NyYy9saWIvbmd4LXBpeGVsLWdyaWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUFHakQsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxjQUFjLENBQW9CLHdCQUF3QixDQUFDLENBQUM7QUFDdEcsTUFBTSxjQUFjLEdBQXNCO0lBQ3hDLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLE1BQU0sRUFBRSxDQUFDO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxPQUFPLEVBQUUsR0FBRztJQUNaLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtJQUNuQyxTQUFTLEVBQUUsb0JBQW9CO0lBQy9CLGNBQWMsRUFBRSxpQkFBaUI7Q0FDbEMsQ0FBQztBQUtGLE1BQU0sT0FBTyxtQkFBbUI7SUFFOUIsWUFBd0QsT0FBMEI7UUFHbEYsWUFBTyxHQUFHLGNBQWMsQ0FBQztRQUZ2QixPQUFPLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFHRCxTQUFTLENBQUMsV0FBc0IsRUFBRSxNQUF5QjtRQUN6RCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDbEMsTUFBTSxhQUFhLEdBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDbkMsTUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUNoQyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxNQUFNLEVBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQ3JCLFFBQVEsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUN0QyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUE7UUFDZCxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3BGLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELGdCQUFnQixDQUFDLFdBQXNCLEVBQUUsTUFBYztRQUNyRCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDMUcsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3RHLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLFdBQXNCLEVBQUUsS0FBYztRQUNyRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBVyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN4QixHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFPLENBQUM7WUFFdkIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLGVBQWUsQ0FBQztZQUNqQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQ25CLE9BQU8sRUFBRSxJQUFJO2dCQUNiLEdBQUc7Z0JBQ0gsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7YUFDOUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsbUJBQW1CLENBQUMsV0FBc0IsRUFBRSxJQUFhLEVBQUUsS0FBaUI7UUFDMUUsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUVuQyxJQUFJLFVBQTZCLENBQUM7UUFDbEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzFCLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztvQkFDcEUsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDdkUsVUFBVSxHQUFHLElBQUksQ0FBQztpQkFDbkI7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEtBQWMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUM7UUFDckUsK0NBQStDO1FBQy9DLHlCQUF5QjtRQUN6QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFFdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzNDLE1BQU0sT0FBTyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sT0FBTyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsV0FBVyxDQUFDO1lBQ3JELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsV0FBVyxDQUFDO1lBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDckIsaUdBQWlHO1FBQ3JHLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWM7UUFDdkIsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ2hELEtBQUssSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDNUQsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNoRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDckIsdUNBQXVDO2FBQ3hDO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7O3NGQXJHVSxtQkFBbUIsY0FFRSxzQkFBc0I7eUVBRjNDLG1CQUFtQixXQUFuQixtQkFBbUIsbUJBRmxCLE1BQU07dUZBRVAsbUJBQW1CO2NBSC9CLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7c0JBR2MsUUFBUTs7c0JBQUksTUFBTTt1QkFBQyxzQkFBc0I7O0FBdUd4RCxTQUFTLG9CQUFvQixDQUFDLEdBQVcsRUFBRSxHQUFXO0lBQ3BELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGl4ZWxHcmlkIH0gZnJvbSAnLi9jbGFzc2VzL3BpeGVsLWdyaWQnO1xuaW1wb3J0IHsgSVBpeGVsR3JpZE9wdGlvbnMsIElQaXhlbEdyaWRTZXJ2aWNlLCBJU2l6ZSwgSVRpbGUgfSBmcm9tICcuL2ludGVyZmFjZXMvbmd4LXBpeGVsLWdyaWQnO1xuXG5leHBvcnQgY29uc3QgTkdYX1BJWEVMX0dSSURfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxJUGl4ZWxHcmlkT3B0aW9ucz4oJ05HWF9QSVhFTF9HUklEX09QVElPTlMnKTtcbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBJUGl4ZWxHcmlkT3B0aW9ucyA9IHtcbiAgaW50cm9BbmltYXRpb246IHRydWUsXG4gIGd1dHRlcjogMSxcbiAgcm93czogMTAwLFxuICBjb2x1bW5zOiAxMDAsXG4gIHRpbGVTaXplOiB7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCB9LFxuICB0aWxlQ29sb3I6ICdyZ2IoMTQwLCAxNDAsIDE0MCknLFxuICB0aWxlSG92ZXJDb2xvcjogJ3JnYig3MCwgNzAsIDcwKSdcbn07XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neFBpeGVsR3JpZFNlcnZpY2UgaW1wbGVtZW50cyBJUGl4ZWxHcmlkU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChOR1hfUElYRUxfR1JJRF9PUFRJT05TKSBvcHRpb25zOiBJUGl4ZWxHcmlkT3B0aW9ucykgeyBcbiAgICBvcHRpb25zICYmIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuICBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbiAgY3JlYXRlQ3R4KHRpbGVzTWF0cml4OiBJVGlsZVtdW10sIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcbiAgICBjdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XG4gICAgY29uc3QgcGl4ZWxHcmlkU2l6ZSA9IFxuICAgICAgdGhpcy5nZXRQaXhlbEdyaWRTaXplKHRpbGVzTWF0cml4LCB0aGlzLm9wdGlvbnMuZ3V0dGVyKTtcbiAgICBjYW52YXMud2lkdGggPSBwaXhlbEdyaWRTaXplLndpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBwaXhlbEdyaWRTaXplLmhlaWdodDtcbiAgICBjYW52YXMuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICBidWlsZFRpbGVzTWF0cml4KCk6IHsgcGl4ZWxHcmlkOiBQaXhlbEdyaWQsIHRpbGVzTWF0cml4OiBJVGlsZVtdW10gfSB7XG4gICAgY29uc3Qge1xuICAgICAgY29sdW1ucywgcm93cywgZ3V0dGVyLFxuICAgICAgdGlsZVNpemUsIHRpbGVDb2xvciwgdGlsZUhvdmVyQ29sb3JcbiAgfSA9IHRoaXMub3B0aW9uc1xuICAgIGNvbnN0IHBpeGVsR3JpZCA9IG5ldyBQaXhlbEdyaWQoY29sdW1ucywgcm93cywgZ3V0dGVyKTtcbiAgICBjb25zdCB0aWxlc01hdHJpeCA9IHBpeGVsR3JpZC5idWlsZFRpbGVzTWF0cml4KHRpbGVTaXplLCB0aWxlQ29sb3IsIHRpbGVIb3ZlckNvbG9yKTtcbiAgICByZXR1cm4geyBwaXhlbEdyaWQsIHRpbGVzTWF0cml4fTtcbiAgfVxuXG4gIGdldFBpeGVsR3JpZFNpemUodGlsZXNNYXRyaXg6IElUaWxlW11bXSwgZ3V0dGVyOiBudW1iZXIpOiBJU2l6ZSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aWxlc01hdHJpeFswXS5sZW5ndGggKiB0aWxlc01hdHJpeFswXVswXS5zaXplLndpZHRoICsgKHRpbGVzTWF0cml4WzBdLmxlbmd0aCAtIDEpICogZ3V0dGVyO1xuICAgIGNvbnN0IGhlaWdodCA9IHRpbGVzTWF0cml4Lmxlbmd0aCAqIHRpbGVzTWF0cml4WzBdWzBdLnNpemUuaGVpZ2h0ICsgKHRpbGVzTWF0cml4Lmxlbmd0aCAtIDEpICogZ3V0dGVyO1xuICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxuXG4gIG1lcmdlVGlsZXNNYXRyaXgodGlsZXNNYXRyaXg6IElUaWxlW11bXSwgdGlsZXM6IElUaWxlW10pOiBJVGlsZVtdW10ge1xuICAgIHRpbGVzLmZvckVhY2goKHRpbGU6IElUaWxlKSA9PiB7XG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltZy5zcmMgPSB0aWxlLmJhc2U2NCE7XG5cbiAgICAgIGNvbnN0IHRpbGVDb29yZGluYXRlcyA9IHRpbGUuY29vcmRpbmF0ZXM7XG4gICAgICBjb25zdCB7IHgsIHkgfSA9IHRpbGVDb29yZGluYXRlcztcbiAgICAgIGNvbnN0IF90aWxlID0gdGlsZXNNYXRyaXhbeF1beV07XG4gICAgICBPYmplY3QuYXNzaWduKF90aWxlLCB7XG4gICAgICAgIGlzUGl4ZWw6IHRydWUsXG4gICAgICAgIGltZyxcbiAgICAgICAgY29sb3I6ICdyYmcoMCwgMCwgMCknLFxuICAgICAgICBocmVmOiB0aWxlLmhyZWYsXG4gICAgICAgIHRvb2x0aXBUZXh0OiB0aWxlLnRvb2x0aXBUZXh0XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGlsZXNNYXRyaXg7XG4gIH1cblxuICB3aGF0VGlsZUlzTW91c2VPdmVyKHRpbGVzTWF0cml4OiBJVGlsZVtdW10sIHJlY3Q6IERPTVJlY3QsIGV2ZW50OiBNb3VzZUV2ZW50KTogSVRpbGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBsZXQgcmV0dXJuVGlsZTogSVRpbGUgfCB1bmRlZmluZWQ7XG4gICAgdGlsZXNNYXRyaXguZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgICAgICBpZiAoeCA+PSB0aWxlLmNvb3JkaW5hdGVzLnggJiYgeCA8PSB0aWxlLmNvb3JkaW5hdGVzLnggKyB0aWxlLnNpemUud2lkdGggJiZcbiAgICAgICAgICAgIHkgPj0gdGlsZS5jb29yZGluYXRlcy55ICYmIHkgPD0gdGlsZS5jb29yZGluYXRlcy55ICsgdGlsZS5zaXplLmhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuVGlsZSA9IHRpbGU7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldHVyblRpbGU7XG4gIH1cblxuICBwaHlsbG90YXhpc0xheW91dCh0aWxlczogSVRpbGVbXSwgeE9mZnNldCA9IDAsIHlPZmZzZXQgPSAwLCBpT2Zmc2V0ID0gMCk6IElUaWxlW10ge1xuICAgIC8vIGNvbnN0IHRoZXRhID0gTWF0aC5QSSAqICg2IC0gTWF0aC5zcXJ0KDIwKSk7XG4gICAgLy8gY29uc3QgcG9pbnRSYWRpdXMgPSA3O1xuICAgIGNvbnN0IHRoZXRhID0gTWF0aC5QSSAqICgzIC0gTWF0aC5zcXJ0KDEwKSk7XG4gICAgY29uc3QgcG9pbnRSYWRpdXMgPSA1O1xuICBcbiAgICB0aWxlcy5mb3JFYWNoKCh0aWxlLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKGkgKyBpT2Zmc2V0KSAlIHRpbGVzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcGh5bGxvWCA9IHBvaW50UmFkaXVzICogTWF0aC5zcXJ0KGluZGV4KSAqIE1hdGguY29zKGluZGV4ICogdGhldGEpO1xuICAgICAgICBjb25zdCBwaHlsbG9ZID0gcG9pbnRSYWRpdXMgKiBNYXRoLnNxcnQoaW5kZXgpICogTWF0aC5zaW4oaW5kZXggKiB0aGV0YSk7XG4gICAgICAgIHRpbGUuY29vcmRpbmF0ZXMueCA9IHhPZmZzZXQgKyBwaHlsbG9YIC0gcG9pbnRSYWRpdXM7XG4gICAgICAgIHRpbGUuY29vcmRpbmF0ZXMueSA9IHlPZmZzZXQgKyBwaHlsbG9ZIC0gcG9pbnRSYWRpdXM7XG4gICAgICAgIHRpbGUuc2l6ZS53aWR0aCA9IDM7XG4gICAgICAgIHRpbGUuc2l6ZS5oZWlnaHQgPSAzO1xuICAgICAgICAvLyB0aWxlLmNvbG9yID0gYGhzbGEoMzAwLCAke35+KDQwICogTWF0aC5yYW5kb20oKSArIDYwKX0lLCAke35+KDYwICogTWF0aC5yYW5kb20oKSArIDIwKX0lLCAxKWA7XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiB0aWxlcztcbiAgfVxuXG4gIGdyaWRMYXlvdXQodGlsZXM6IElUaWxlW10pOiBJVGlsZVtdIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLm9wdGlvbnMucm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMub3B0aW9ucy5jb2x1bW5zOyBjb2x1bW4rKykge1xuICAgICAgICBjb25zdCB0aWxlID0gdGlsZXNbcm93ICogdGhpcy5vcHRpb25zLmNvbHVtbnMgKyBjb2x1bW5dO1xuICAgICAgICB0aWxlLmNvb3JkaW5hdGVzLnggPSBjb2x1bW4gKiAodGhpcy5vcHRpb25zLnRpbGVTaXplLndpZHRoICsgdGhpcy5vcHRpb25zLmd1dHRlcik7XG4gICAgICAgIHRpbGUuY29vcmRpbmF0ZXMueSA9IHJvdyAqICh0aGlzLm9wdGlvbnMudGlsZVNpemUuaGVpZ2h0ICsgdGhpcy5vcHRpb25zLmd1dHRlcik7XG4gICAgICAgIHRpbGUuc2l6ZS53aWR0aCA9IDk7XG4gICAgICAgIHRpbGUuc2l6ZS5oZWlnaHQgPSA5O1xuICAgICAgICAvLyB0aWxlLmNvbG9yID0gdGhpcy5vcHRpb25zLnRpbGVDb2xvcjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRpbGVzO1xuICB9XG59XG5cblxuZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRhcnlJbnQobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xufSJdfQ==