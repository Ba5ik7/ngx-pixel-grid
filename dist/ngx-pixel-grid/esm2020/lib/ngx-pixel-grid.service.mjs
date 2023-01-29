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
            const { x, y } = tileCoordinates;
            const _tile = tilesMatrix[x][y];
            Object.assign(_tile, {
                isPixel: true,
                img: tile.img,
                color: 'rbg(0, 0, 0)',
                href: tile.href,
                tooltipText: tile.tooltipText
            });
        });
        return tilesMatrix;
    }
    phyllotaxisLayout(tilesMatrix, xOffset = 0, yOffset = 0, iOffset = 0) {
        // theta determines the spiral of the layout
        const theta = Math.PI * (3 - Math.sqrt(5));
        const pointRadius = this.tileSize.width / 2;
        tilesMatrix.forEach((row, i) => {
            const index = (i + iOffset) % tilesMatrix.length;
            const phylloX = pointRadius * Math.sqrt(index) * Math.cos(index * theta);
            const phylloY = pointRadius * Math.sqrt(index) * Math.sin(index * theta);
            row.forEach(tile => {
                tile.coordinates.x = xOffset + phylloX - pointRadius;
                tile.coordinates.y = yOffset + phylloY - pointRadius;
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1waXhlbC1ncmlkL3NyYy9saWIvbmd4LXBpeGVsLWdyaWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUc3RSxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBb0Isd0JBQXdCLENBQUMsQ0FBQztBQUl0RyxNQUFNLE9BQU8sbUJBQW1CO0lBRTlCLFlBQXdELE9BQTBCO1FBWWxGLG1CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLFNBQUksR0FBRyxHQUFHLENBQUM7UUFDWCxZQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ2QsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLGFBQVEsR0FBVSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQzVDLGNBQVMsR0FBcUIsb0JBQW9CLENBQUM7UUFDbkQsbUJBQWMsR0FBcUIsY0FBYyxDQUFDO1FBakJoRCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFVRCxnQkFBZ0IsQ0FBQyxXQUFzQixFQUFFLEtBQWM7UUFDckQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVcsRUFBRSxFQUFFO1lBQzVCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDekMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxlQUFlLENBQUM7WUFDakMsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNuQixPQUFPLEVBQUUsSUFBSTtnQkFDYixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7YUFDOUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsV0FBc0IsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUM7UUFDN0UsNENBQTRDO1FBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUU1QyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDakQsTUFBTSxPQUFPLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDekUsTUFBTSxPQUFPLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDekUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLE9BQU8sR0FBRyxXQUFXLENBQUM7Z0JBQ3JELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsV0FBVyxDQUFDO1lBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOztzRkF2RFUsbUJBQW1CLGNBRUUsc0JBQXNCO3lFQUYzQyxtQkFBbUIsV0FBbkIsbUJBQW1CLG1CQUZsQixNQUFNO3VGQUVQLG1CQUFtQjtjQUgvQixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7O3NCQUdjLFFBQVE7O3NCQUFJLE1BQU07dUJBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEhFWCwgSVBpeGVsR3JpZE9wdGlvbnMsIElTaXplLCBJVGlsZSwgUkdCLCBSR0JBIH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcblxuZXhwb3J0IGNvbnN0IE5HWF9QSVhFTF9HUklEX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48SVBpeGVsR3JpZE9wdGlvbnM+KCdOR1hfUElYRUxfR1JJRF9PUFRJT05TJyk7XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRTZXJ2aWNlIGltcGxlbWVudHMgSVBpeGVsR3JpZE9wdGlvbnMge1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTkdYX1BJWEVMX0dSSURfT1BUSU9OUykgb3B0aW9uczogSVBpeGVsR3JpZE9wdGlvbnMpIHsgXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuaW50cm9BbmltYXRpb24gPSBvcHRpb25zLmludHJvQW5pbWF0aW9uO1xuICAgICAgdGhpcy5yb3dzID0gb3B0aW9ucy5yb3dzO1xuICAgICAgdGhpcy5jb2x1bW5zID0gb3B0aW9ucy5jb2x1bW5zO1xuICAgICAgdGhpcy5ndXR0ZXIgPSBvcHRpb25zLmd1dHRlcjtcbiAgICAgIHRoaXMudGlsZVNpemUgPSBvcHRpb25zLnRpbGVTaXplO1xuICAgICAgdGhpcy50aWxlQ29sb3IgPSBvcHRpb25zLnRpbGVDb2xvcjtcbiAgICAgIHRoaXMudGlsZUhvdmVyQ29sb3IgPSBvcHRpb25zLnRpbGVIb3ZlckNvbG9yO1xuICAgIH1cbiAgfVxuXG4gIGludHJvQW5pbWF0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgcm93cyA9IDEwMDtcbiAgY29sdW1ucyA9IDEwMDtcbiAgZ3V0dGVyID0gMTtcbiAgdGlsZVNpemU6IElTaXplID0geyB3aWR0aDogMTAsIGhlaWdodDogMTAgfTtcbiAgdGlsZUNvbG9yOiBSR0IgfCBSR0JBIHwgSEVYID0gJ3JnYigyNTUsIDI1NSwgMjU1KSc7XG4gIHRpbGVIb3ZlckNvbG9yOiBSR0IgfCBSR0JBIHwgSEVYID0gJ3JnYigwLCAwLCAwKSc7XG5cbiAgbWVyZ2VUaWxlc01hdHJpeCh0aWxlc01hdHJpeDogSVRpbGVbXVtdLCB0aWxlczogSVRpbGVbXSk6IElUaWxlW11bXSB7XG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZTogSVRpbGUpID0+IHtcbiAgICAgIGNvbnN0IHRpbGVDb29yZGluYXRlcyA9IHRpbGUuY29vcmRpbmF0ZXM7XG4gICAgICBjb25zdCB7IHgsIHkgfSA9IHRpbGVDb29yZGluYXRlcztcbiAgICAgIGNvbnN0IF90aWxlID0gdGlsZXNNYXRyaXhbeF1beV07XG4gICAgICBPYmplY3QuYXNzaWduKF90aWxlLCB7XG4gICAgICAgIGlzUGl4ZWw6IHRydWUsXG4gICAgICAgIGltZzogdGlsZS5pbWcsXG4gICAgICAgIGNvbG9yOiAncmJnKDAsIDAsIDApJyxcbiAgICAgICAgaHJlZjogdGlsZS5ocmVmLFxuICAgICAgICB0b29sdGlwVGV4dDogdGlsZS50b29sdGlwVGV4dFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRpbGVzTWF0cml4O1xuICB9XG5cbiAgcGh5bGxvdGF4aXNMYXlvdXQodGlsZXNNYXRyaXg6IElUaWxlW11bXSwgeE9mZnNldCA9IDAsIHlPZmZzZXQgPSAwLCBpT2Zmc2V0ID0gMCkge1xuICAgIC8vIHRoZXRhIGRldGVybWluZXMgdGhlIHNwaXJhbCBvZiB0aGUgbGF5b3V0XG4gICAgY29uc3QgdGhldGEgPSBNYXRoLlBJICogKDMgLSBNYXRoLnNxcnQoNSkpO1xuICBcbiAgICBjb25zdCBwb2ludFJhZGl1cyA9IHRoaXMudGlsZVNpemUud2lkdGggLyAyO1xuICBcbiAgICB0aWxlc01hdHJpeC5mb3JFYWNoKChyb3csIGkpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gKGkgKyBpT2Zmc2V0KSAlIHRpbGVzTWF0cml4Lmxlbmd0aDtcbiAgICAgIGNvbnN0IHBoeWxsb1ggPSBwb2ludFJhZGl1cyAqIE1hdGguc3FydChpbmRleCkgKiBNYXRoLmNvcyhpbmRleCAqIHRoZXRhKTtcbiAgICAgIGNvbnN0IHBoeWxsb1kgPSBwb2ludFJhZGl1cyAqIE1hdGguc3FydChpbmRleCkgKiBNYXRoLnNpbihpbmRleCAqIHRoZXRhKTtcbiAgICAgIHJvdy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICB0aWxlLmNvb3JkaW5hdGVzLnggPSB4T2Zmc2V0ICsgcGh5bGxvWCAtIHBvaW50UmFkaXVzO1xuICAgICAgICB0aWxlLmNvb3JkaW5hdGVzLnkgPSB5T2Zmc2V0ICsgcGh5bGxvWSAtIHBvaW50UmFkaXVzO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiB0aWxlc01hdHJpeDtcbiAgfVxufVxuXG5cblxuIl19