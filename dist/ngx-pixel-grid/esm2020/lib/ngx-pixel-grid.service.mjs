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
NgxPixelGridService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridService, deps: [{ token: NGX_PIXEL_GRID_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
NgxPixelGridService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_PIXEL_GRID_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1waXhlbC1ncmlkL3NyYy9saWIvbmd4LXBpeGVsLWdyaWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUc3RSxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBb0Isd0JBQXdCLENBQUMsQ0FBQztBQUl0RyxNQUFNLE9BQU8sbUJBQW1CO0lBRTlCLFlBQXdELE9BQTBCO1FBWWxGLG1CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLFNBQUksR0FBRyxHQUFHLENBQUM7UUFDWCxZQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ2QsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLGFBQVEsR0FBVSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQzVDLGNBQVMsR0FBcUIsb0JBQW9CLENBQUM7UUFDbkQsbUJBQWMsR0FBcUIsY0FBYyxDQUFDO1FBakJoRCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFVRCxnQkFBZ0IsQ0FBQyxXQUFzQixFQUFFLEtBQWM7UUFDckQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVcsRUFBRSxFQUFFO1lBQzVCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDekMsTUFBTSxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzVCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNqQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztZQUN6QyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbkMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7aUhBbENVLG1CQUFtQixrQkFFRSxzQkFBc0I7cUhBRjNDLG1CQUFtQixjQUZsQixNQUFNOzRGQUVQLG1CQUFtQjtrQkFIL0IsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQUdjLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEhFWCwgSVBpeGVsR3JpZE9wdGlvbnMsIElTaXplLCBJVGlsZSwgUkdCLCBSR0JBIH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcblxuZXhwb3J0IGNvbnN0IE5HWF9QSVhFTF9HUklEX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48SVBpeGVsR3JpZE9wdGlvbnM+KCdOR1hfUElYRUxfR1JJRF9PUFRJT05TJyk7XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRTZXJ2aWNlIGltcGxlbWVudHMgSVBpeGVsR3JpZE9wdGlvbnMge1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTkdYX1BJWEVMX0dSSURfT1BUSU9OUykgb3B0aW9uczogSVBpeGVsR3JpZE9wdGlvbnMpIHsgXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuaW50cm9BbmltYXRpb24gPSBvcHRpb25zLmludHJvQW5pbWF0aW9uO1xuICAgICAgdGhpcy5yb3dzID0gb3B0aW9ucy5yb3dzO1xuICAgICAgdGhpcy5jb2x1bW5zID0gb3B0aW9ucy5jb2x1bW5zO1xuICAgICAgdGhpcy5ndXR0ZXIgPSBvcHRpb25zLmd1dHRlcjtcbiAgICAgIHRoaXMudGlsZVNpemUgPSBvcHRpb25zLnRpbGVTaXplO1xuICAgICAgdGhpcy50aWxlQ29sb3IgPSBvcHRpb25zLnRpbGVDb2xvcjtcbiAgICAgIHRoaXMudGlsZUhvdmVyQ29sb3IgPSBvcHRpb25zLnRpbGVIb3ZlckNvbG9yO1xuICAgIH1cbiAgfVxuXG4gIGludHJvQW5pbWF0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgcm93cyA9IDEwMDtcbiAgY29sdW1ucyA9IDEwMDtcbiAgZ3V0dGVyID0gMTtcbiAgdGlsZVNpemU6IElTaXplID0geyB3aWR0aDogMTAsIGhlaWdodDogMTAgfTtcbiAgdGlsZUNvbG9yOiBSR0IgfCBSR0JBIHwgSEVYID0gJ3JnYigyNTUsIDI1NSwgMjU1KSc7XG4gIHRpbGVIb3ZlckNvbG9yOiBSR0IgfCBSR0JBIHwgSEVYID0gJ3JnYigwLCAwLCAwKSc7XG5cbiAgbWVyZ2VUaWxlc01hdHJpeCh0aWxlc01hdHJpeDogSVRpbGVbXVtdLCB0aWxlczogSVRpbGVbXSk6IElUaWxlW11bXSB7XG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZTogSVRpbGUpID0+IHtcbiAgICAgIGNvbnN0IHRpbGVDb29yZGluYXRlcyA9IHRpbGUuY29vcmRpbmF0ZXM7XG4gICAgICBjb25zdCB5ID0gdGlsZUNvb3JkaW5hdGVzLnk7XG4gICAgICBjb25zdCB4ID0gdGlsZUNvb3JkaW5hdGVzLng7ICBcbiAgICAgIHRpbGVzTWF0cml4W3hdW3ldLmlzUGl4ZWwgPSB0cnVlO1xuICAgICAgdGlsZXNNYXRyaXhbeF1beV0uaW1nID0gdGlsZS5pbWc7XG4gICAgICB0aWxlc01hdHJpeFt4XVt5XS5jb2xvciA9ICdyYmcoMCwgMCwgMCknO1xuICAgICAgdGlsZXNNYXRyaXhbeF1beV0uaHJlZiA9IHRpbGUuaHJlZjtcbiAgICAgIHRpbGVzTWF0cml4W3hdW3ldLnRvb2x0aXBUZXh0ID0gdGlsZS50b29sdGlwVGV4dDtcbiAgICB9KTtcbiAgICByZXR1cm4gdGlsZXNNYXRyaXg7XG4gIH1cbn1cblxuXG5cbiJdfQ==