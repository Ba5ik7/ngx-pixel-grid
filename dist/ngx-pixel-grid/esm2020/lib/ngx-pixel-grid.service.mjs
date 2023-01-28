import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import * as i0 from "@angular/core";
export const NGX_PIXEL_GRID_OPTIONS = new InjectionToken('NGX_PIXEL_GRID_OPTIONS');
export class NgxPixelGridService {
    constructor(options) {
        this.introAnimation = true;
        this.rows = 100;
        this.columns = 100;
        this.gutter = 1;
        this.tileSize = { width: 10, height: 10 };
        this.tileColor = 'rgb(255, 255, 255)';
        this.tileHoverColor = 'rgb(0, 0, 0)';
        if (options) {
            this.introAnimation = options.introAnimation;
            this.rows = options.rows;
            this.columns = options.columns;
            this.gutter = options.gutter;
            this.tileSize = options.tileSize;
            this.tileColor = options.tileColor;
            this.tileHoverColor = options.tileHoverColor;
        }
    }
    mergeTilesMatrix(tilesMatrix, tiles) {
        tiles.forEach((tile) => {
            const tileCoordinates = tile.coordinates;
            const y = tileCoordinates.y;
            const x = tileCoordinates.x;
            tilesMatrix[x][y].isPixel = true;
            tilesMatrix[x][y].img = tile.img;
            tilesMatrix[x][y].color = 'rbg(0, 0, 0)';
            tilesMatrix[x][y].href = tile.href;
            tilesMatrix[x][y].tooltipText = tile.tooltipText;
        });
        return tilesMatrix;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1waXhlbC1ncmlkL3NyYy9saWIvbmd4LXBpeGVsLWdyaWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUc3RSxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBb0Isd0JBQXdCLENBQUMsQ0FBQztBQUl0RyxNQUFNLE9BQU8sbUJBQW1CO0lBRTlCLFlBQXdELE9BQTBCO1FBWWxGLG1CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLFNBQUksR0FBRyxHQUFHLENBQUM7UUFDWCxZQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ2QsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLGFBQVEsR0FBVSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQzVDLGNBQVMsR0FBcUIsb0JBQW9CLENBQUM7UUFDbkQsbUJBQWMsR0FBcUIsY0FBYyxDQUFDO1FBakJoRCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFVRCxnQkFBZ0IsQ0FBQyxXQUFzQixFQUFFLEtBQWM7UUFDckQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVcsRUFBRSxFQUFFO1lBQzVCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDekMsTUFBTSxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzVCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNqQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztZQUN6QyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbkMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7c0ZBbENVLG1CQUFtQixjQUVFLHNCQUFzQjt5RUFGM0MsbUJBQW1CLFdBQW5CLG1CQUFtQixtQkFGbEIsTUFBTTt1RkFFUCxtQkFBbUI7Y0FIL0IsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COztzQkFHYyxRQUFROztzQkFBSSxNQUFNO3VCQUFDLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIRVgsIElQaXhlbEdyaWRPcHRpb25zLCBJU2l6ZSwgSVRpbGUsIFJHQiwgUkdCQSB9IGZyb20gJy4vaW50ZXJmYWNlcy9uZ3gtcGl4ZWwtZ3JpZCc7XG5cbmV4cG9ydCBjb25zdCBOR1hfUElYRUxfR1JJRF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPElQaXhlbEdyaWRPcHRpb25zPignTkdYX1BJWEVMX0dSSURfT1BUSU9OUycpO1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkU2VydmljZSBpbXBsZW1lbnRzIElQaXhlbEdyaWRPcHRpb25zIHtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE5HWF9QSVhFTF9HUklEX09QVElPTlMpIG9wdGlvbnM6IElQaXhlbEdyaWRPcHRpb25zKSB7IFxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB0aGlzLmludHJvQW5pbWF0aW9uID0gb3B0aW9ucy5pbnRyb0FuaW1hdGlvbjtcbiAgICAgIHRoaXMucm93cyA9IG9wdGlvbnMucm93cztcbiAgICAgIHRoaXMuY29sdW1ucyA9IG9wdGlvbnMuY29sdW1ucztcbiAgICAgIHRoaXMuZ3V0dGVyID0gb3B0aW9ucy5ndXR0ZXI7XG4gICAgICB0aGlzLnRpbGVTaXplID0gb3B0aW9ucy50aWxlU2l6ZTtcbiAgICAgIHRoaXMudGlsZUNvbG9yID0gb3B0aW9ucy50aWxlQ29sb3I7XG4gICAgICB0aGlzLnRpbGVIb3ZlckNvbG9yID0gb3B0aW9ucy50aWxlSG92ZXJDb2xvcjtcbiAgICB9XG4gIH1cblxuICBpbnRyb0FuaW1hdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIHJvd3MgPSAxMDA7XG4gIGNvbHVtbnMgPSAxMDA7XG4gIGd1dHRlciA9IDE7XG4gIHRpbGVTaXplOiBJU2l6ZSA9IHsgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwIH07XG4gIHRpbGVDb2xvcjogUkdCIHwgUkdCQSB8IEhFWCA9ICdyZ2IoMjU1LCAyNTUsIDI1NSknO1xuICB0aWxlSG92ZXJDb2xvcjogUkdCIHwgUkdCQSB8IEhFWCA9ICdyZ2IoMCwgMCwgMCknO1xuXG4gIG1lcmdlVGlsZXNNYXRyaXgodGlsZXNNYXRyaXg6IElUaWxlW11bXSwgdGlsZXM6IElUaWxlW10pOiBJVGlsZVtdW10ge1xuICAgIHRpbGVzLmZvckVhY2goKHRpbGU6IElUaWxlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlQ29vcmRpbmF0ZXMgPSB0aWxlLmNvb3JkaW5hdGVzO1xuICAgICAgY29uc3QgeSA9IHRpbGVDb29yZGluYXRlcy55O1xuICAgICAgY29uc3QgeCA9IHRpbGVDb29yZGluYXRlcy54OyAgXG4gICAgICB0aWxlc01hdHJpeFt4XVt5XS5pc1BpeGVsID0gdHJ1ZTtcbiAgICAgIHRpbGVzTWF0cml4W3hdW3ldLmltZyA9IHRpbGUuaW1nO1xuICAgICAgdGlsZXNNYXRyaXhbeF1beV0uY29sb3IgPSAncmJnKDAsIDAsIDApJztcbiAgICAgIHRpbGVzTWF0cml4W3hdW3ldLmhyZWYgPSB0aWxlLmhyZWY7XG4gICAgICB0aWxlc01hdHJpeFt4XVt5XS50b29sdGlwVGV4dCA9IHRpbGUudG9vbHRpcFRleHQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRpbGVzTWF0cml4O1xuICB9XG59XG5cblxuXG4iXX0=