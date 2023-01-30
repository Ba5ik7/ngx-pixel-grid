import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-pixel-grid.service";
import * as i2 from "@angular/cdk/overlay";
export class NgxPixelGridComponent {
    constructor(ngZone, pixelGridService, tooltipOverlay) {
        this.ngZone = ngZone;
        this.pixelGridService = pixelGridService;
        this.tooltipOverlay = tooltipOverlay;
        this.tileClick = new EventEmitter();
        this.hasLoadedPixels = false;
        this.tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
        this.timeDelta = 0.005 * .05;
        this.time = 0;
        this.handleMouseClick = (event) => {
            const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
            const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
            tile && this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
        };
        this.handleMouseOut = () => {
            if (this.currentTileBeingHovered) {
                this.currentTileBeingHovered.color = this.pixelGridService.options.tileColor;
                this.currentTileBeingHovered = undefined;
            }
            this.tooltipRef.dispose?.();
        };
        this.handleMouseMove = (event) => {
            const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
            const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
            if (tile) {
                // Kind of tricky here, want to leave comment for future reference
                // We are just trying to swap out colors of the tile we are hovering on
                // So a refernce is made to the tile we are hovering on and the color is changed
                // If the tile that is currently being hovered on is the same as the tile we are hovering on, return
                if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id)
                    return;
                // If the tooltip is open, close it
                // !@TODO - Should only detach if the new tile is on same tile group as the last
                if (this.tooltipRef)
                    this.tooltipRef.detach();
                // If the tile that is currently being hovered on is different than the tile we are hovering on, 
                // we need to change the color back to the original color
                if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
                    this.currentTileBeingHovered.color = tile.color;
                }
                // Set the reference to the tile we are hovering on
                this.currentTileBeingHovered = tile;
                // Change the color of the tile we are hovering on to the hover color
                this.currentTileBeingHovered.color = tile.hoverColor;
                const positionStrategy = this.tooltipOverlay
                    .position().global()
                    .top(`${event.clientY + 15}px`)
                    .left(`${event.clientX + 15}px`);
                this.tooltipRef = this.tooltipOverlay.create({
                    positionStrategy,
                    hasBackdrop: false,
                    scrollStrategy: this.tooltipOverlay.scrollStrategies.close()
                });
                const tooltipComponent = this.tooltipRef.attach(this.tooltipPortal);
                tooltipComponent.instance.text = tile.tooltipText ?? tile.id.toString();
            }
        };
    }
    set pixels(tiles) {
        if (!tiles || !tiles.length)
            return;
        this.tilesMatrix = this.pixelGridService.mergeTilesMatrix(this.tilesMatrix, tiles);
        requestAnimationFrame(() => {
            this.hasLoadedPixels = true;
        });
    }
    ngOnInit() {
        const { pixelGrid, tilesMatrix } = this.pixelGridService.buildTilesMatrix();
        this.pixelGrid = pixelGrid;
        this.tilesMatrix = tilesMatrix;
    }
    ngAfterViewInit() {
        const canvas = this.pixelGridCanvas.nativeElement;
        this.ctx = this.pixelGridService.createCtx(this.tilesMatrix, canvas);
        canvas.addEventListener('click', this.handleMouseClick);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('mouseout', this.handleMouseOut);
        this.ngZone.runOutsideAngular(() => requestAnimationFrame(this.loop.bind(this)));
    }
    // switchLayout = true;
    loop(timestamp) {
        this.ctx.clearRect(0, 0, this.pixelGridCanvas.nativeElement.width, this.pixelGridCanvas.nativeElement.height);
        // this.time += this.timeDelta;
        this.time += (Math.sin(this.time) < 0 ? .3 : -Math.cos(this.time) > 0.5 ? 0.3 : 0.8) * this.timeDelta;
        if (this.time > 1) {
            this.time = 0;
            // this.switchLayout = !this.switchLayout;
        }
        this.pixelGrid.tiles.forEach(tile => {
            tile.sourceCoordinates.x = tile.coordinates.x;
            tile.sourceCoordinates.y = tile.coordinates.y;
        });
        let tiles = this.pixelGrid.tiles;
        if (this.hasLoadedPixels) {
            tiles = this.pixelGridService.gridLayout(this.pixelGrid.tiles);
        }
        else {
            tiles = this.pixelGridService.phyllotaxisLayout(this.pixelGrid.tiles, this.pixelGridCanvas.nativeElement.width * .5, this.pixelGridCanvas.nativeElement.height * .5);
        }
        tiles.forEach(tile => {
            tile.targetCoordinates.x = tile.coordinates.x;
            tile.targetCoordinates.y = tile.coordinates.y;
            tile.coordinates.x = tile.sourceCoordinates.x * (1 - this.time) + tile.targetCoordinates.x * this.time;
            tile.coordinates.y = tile.sourceCoordinates.y * (1 - this.time) + tile.targetCoordinates.y * this.time;
            if (tile.isPixel) {
                this.ctx.drawImage(tile.img, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
            }
            else {
                this.ctx.fillStyle = tile.color;
                this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
            }
        });
        requestAnimationFrame(this.loop.bind(this));
    }
}
NgxPixelGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridComponent, deps: [{ token: i0.NgZone }, { token: i1.NgxPixelGridService }, { token: i2.Overlay }], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridComponent, selector: "ngx-pixel-grid", inputs: { pixels: "pixels" }, outputs: { tileClick: "tileClick" }, viewQueries: [{ propertyName: "pixelGridCanvasContatiner", first: true, predicate: ["pixelGridCanvasContatiner"], descendants: true }, { propertyName: "pixelGridCanvas", first: true, predicate: ["pixelGridCanvas"], descendants: true }], ngImport: i0, template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`, isInline: true, styles: [".pixel-grid-canvas-container{width:100%;height:100%}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pixel-grid', template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".pixel-grid-canvas-container{width:100%;height:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i1.NgxPixelGridService }, { type: i2.Overlay }]; }, propDecorators: { tileClick: [{
                type: Output
            }], pixels: [{
                type: Input
            }], pixelGridCanvasContatiner: [{
                type: ViewChild,
                args: ['pixelGridCanvasContatiner']
            }], pixelGridCanvas: [{
                type: ViewChild,
                args: ['pixelGridCanvas']
            }] } });
export class NgxPixelGridTooltipComponent {
}
NgxPixelGridTooltipComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridTooltipComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridTooltipComponent, selector: "ngx-pixel-grid-tooltip", inputs: { text: "text" }, ngImport: i0, template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, isInline: true, styles: [".tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"], encapsulation: i0.ViewEncapsulation.ShadowDom });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pixel-grid-tooltip', template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, encapsulation: ViewEncapsulation.ShadowDom, styles: [".tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] }]
        }], propDecorators: { text: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7Ozs7QUFjdkIsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxZQUNVLE1BQWMsRUFDZCxnQkFBcUMsRUFDckMsY0FBdUI7UUFGdkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBcUI7UUFDckMsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFHdkIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRTFELG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBaUJ4QixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFtQmxFLGNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLFNBQUksR0FBRyxDQUFDLENBQUM7UUE2Q1QscUJBQWdCLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEYsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxD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QyxLQUFLLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDOUY7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7bUhBMUZVLHFCQUFxQjt1R0FBckIscUJBQXFCLHNXQVB0Qjs7O1NBR0g7NEZBSUkscUJBQXFCO2tCQVRqQyxTQUFTOytCQUNFLGdCQUFnQixZQUNoQjs7O1NBR0gsbUJBRVUsdUJBQXVCLENBQUMsTUFBTTtxSkFVckMsU0FBUztzQkFBbEIsTUFBTTtnQkFHTSxNQUFNO3NCQUFsQixLQUFLO2dCQVFrQyx5QkFBeUI7c0JBQWhFLFNBQVM7dUJBQUMsMkJBQTJCO2dCQUNSLGVBQWU7c0JBQTVDLFNBQVM7dUJBQUMsaUJBQWlCOztBQXNJOUIsTUFBTSxPQUFPLDRCQUE0Qjs7MEhBQTVCLDRCQUE0Qjs4R0FBNUIsNEJBQTRCLHdGQUo3Qix3RUFBd0U7NEZBSXZFLDRCQUE0QjtrQkFOeEMsU0FBUzsrQkFDRSx3QkFBd0IsWUFDeEIsd0VBQXdFLGlCQUVuRSxpQkFBaUIsQ0FBQyxTQUFTOzhCQUVTLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGl4ZWxHcmlkIH0gZnJvbSAnLi9jbGFzc2VzL3BpeGVsLWdyaWQnO1xuaW1wb3J0IHsgSVRpbGUsIElUaWxlQ2xpY2tFdmVudCB9IGZyb20gJy4vaW50ZXJmYWNlcy9uZ3gtcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBOZ3hQaXhlbEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtcGl4ZWwtZ3JpZC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXBpeGVsLWdyaWQnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2ICNwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyIGNsYXNzPVwicGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyXCI+XG4gICAgPGNhbnZhcyAjcGl4ZWxHcmlkQ2FudmFzPjwvY2FudmFzPlxuICA8L2Rpdj5gLFxuICBzdHlsZXM6IFsnLnBpeGVsLWdyaWQtY2FudmFzLWNvbnRhaW5lciB7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IH0nXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHBpeGVsR3JpZFNlcnZpY2U6IE5neFBpeGVsR3JpZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b29sdGlwT3ZlcmxheTogT3ZlcmxheVxuICApIHsgfVxuICBcbiAgQE91dHB1dCgpIHRpbGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SVRpbGVDbGlja0V2ZW50PigpO1xuXG4gIGhhc0xvYWRlZFBpeGVscyA9IGZhbHNlO1xuICBASW5wdXQoKSBzZXQgcGl4ZWxzKHRpbGVzOiBJVGlsZVtdKSB7XG4gICAgaWYgKCF0aWxlcyB8fCAhdGlsZXMubGVuZ3RoKSByZXR1cm47XG4gICAgdGhpcy50aWxlc01hdHJpeCA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5tZXJnZVRpbGVzTWF0cml4KHRoaXMudGlsZXNNYXRyaXgsIHRpbGVzKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5oYXNMb2FkZWRQaXhlbHMgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgQFZpZXdDaGlsZCgncGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lcicpIHBpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncGl4ZWxHcmlkQ2FudmFzJykgcGl4ZWxHcmlkQ2FudmFzITogRWxlbWVudFJlZjxIVE1MQ2FudmFzRWxlbWVudD47XG5cbiAgY3R4ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwaXhlbEdyaWQhOiBQaXhlbEdyaWQ7XG4gIHRpbGVzTWF0cml4ITogSVRpbGVbXVtdO1xuXG4gIHRvb2x0aXBSZWYhOiBPdmVybGF5UmVmO1xuICB0b29sdGlwUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChOZ3hQaXhlbEdyaWRUb29sdGlwQ29tcG9uZW50KTtcblxuICBuZ09uSW5pdCgpOiB2b2lkIHsgICAgXG4gICAgY29uc3QgeyBwaXhlbEdyaWQsIHRpbGVzTWF0cml4IH0gPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuYnVpbGRUaWxlc01hdHJpeCgpO1xuICAgIHRoaXMucGl4ZWxHcmlkID0gcGl4ZWxHcmlkO1xuICAgIHRoaXMudGlsZXNNYXRyaXggPSB0aWxlc01hdHJpeDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuY3R4ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmNyZWF0ZUN0eCh0aGlzLnRpbGVzTWF0cml4LCBjYW52YXMpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlTW91c2VDbGljayk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmhhbmRsZU1vdXNlT3V0KTtcbiAgICBcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpKTtcbiAgfVxuICBcblxuICB0aW1lRGVsdGEgPSAwLjAwNSAqIC4wNTtcbiAgdGltZSA9IDA7XG4gIC8vIHN3aXRjaExheW91dCA9IHRydWU7XG4gIGxvb3AodGltZXN0YW1wOiBudW1iZXIpOiB2b2lkIHtcbiAgICBcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCwgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQpO1xuICAgIC8vIHRoaXMudGltZSArPSB0aGlzLnRpbWVEZWx0YTtcbiAgICB0aGlzLnRpbWUgKz0gKE1hdGguc2luKHRoaXMudGltZSkgPCAwID8gLjMgOiAtTWF0aC5jb3ModGhpcy50aW1lKSA+IDAuNSA/IDAuMyA6IDAuOCkgKiB0aGlzLnRpbWVEZWx0YTtcbiAgICBcbiAgICBpZiAodGhpcy50aW1lID4gMSkge1xuICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgIC8vIHRoaXMuc3dpdGNoTGF5b3V0ID0gIXRoaXMuc3dpdGNoTGF5b3V0O1xuICAgIH1cbiAgICAgIFxuICAgIHRoaXMucGl4ZWxHcmlkLnRpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICB0aWxlLnNvdXJjZUNvb3JkaW5hdGVzLnggPSB0aWxlLmNvb3JkaW5hdGVzLng7XG4gICAgICB0aWxlLnNvdXJjZUNvb3JkaW5hdGVzLnkgPSB0aWxlLmNvb3JkaW5hdGVzLnk7XG4gICAgfSk7XG5cblxuICAgIGxldCB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkLnRpbGVzO1xuICAgIGlmKHRoaXMuaGFzTG9hZGVkUGl4ZWxzKSB7XG4gICAgICB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5ncmlkTGF5b3V0KHRoaXMucGl4ZWxHcmlkLnRpbGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGlsZXMgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UucGh5bGxvdGF4aXNMYXlvdXQoXG4gICAgICAgIHRoaXMucGl4ZWxHcmlkLnRpbGVzLFxuICAgICAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoICogLjUsXG4gICAgICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ICogLjVcbiAgICAgICkgXG4gICAgfVxuXG4gICAgdGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueCA9IHRpbGUuY29vcmRpbmF0ZXMueDtcbiAgICAgIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueSA9IHRpbGUuY29vcmRpbmF0ZXMueTtcbiAgICAgIHRpbGUuY29vcmRpbmF0ZXMueCA9IHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueCAqICgxIC0gdGhpcy50aW1lKSArIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueCAqIHRoaXMudGltZTtcbiAgICAgIHRpbGUuY29vcmRpbmF0ZXMueSA9IHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueSAqICgxIC0gdGhpcy50aW1lKSArIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueSAqIHRoaXMudGltZTtcbiAgICAgIGlmICh0aWxlLmlzUGl4ZWwpIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRpbGUuaW1nISwgdGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCArIDEsIHRpbGUuc2l6ZS5oZWlnaHQgKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRpbGUuY29sb3I7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGgsIHRpbGUuc2l6ZS5oZWlnaHQpO1xuICAgICAgfVxuICAgIH0pOyAgIFxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS53aGF0VGlsZUlzTW91c2VPdmVyKHRoaXMudGlsZXNNYXRyaXgsIHJlY3QsIGV2ZW50KTtcbiAgICB0aWxlICYmIHRoaXMudGlsZUNsaWNrLmVtaXQoeyBpZDogdGlsZS5pZCwgaHJlZjogdGlsZS5ocmVmID8/IHVuZGVmaW5lZCB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkKSB7XG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLm9wdGlvbnMudGlsZUNvbG9yO1xuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy50b29sdGlwUmVmLmRpc3Bvc2U/LigpO1xuICB9XG5cbiAgY3VycmVudFRpbGVCZWluZ0hvdmVyZWQ6IElUaWxlIHwgdW5kZWZpbmVkO1xuICBoYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLndoYXRUaWxlSXNNb3VzZU92ZXIodGhpcy50aWxlc01hdHJpeCwgcmVjdCwgZXZlbnQpO1xuICAgIGlmICh0aWxlKSB7XG4gICAgICAvLyBLaW5kIG9mIHRyaWNreSBoZXJlLCB3YW50IHRvIGxlYXZlIGNvbW1lbnQgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgIC8vIFdlIGFyZSBqdXN0IHRyeWluZyB0byBzd2FwIG91dCBjb2xvcnMgb2YgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uXG4gICAgICAvLyBTbyBhIHJlZmVybmNlIGlzIG1hZGUgdG8gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uIGFuZCB0aGUgY29sb3IgaXMgY2hhbmdlZFxuICAgICAgLy8gSWYgdGhlIHRpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgaG92ZXJlZCBvbiBpcyB0aGUgc2FtZSBhcyB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24sIHJldHVyblxuICAgICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgJiYgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5pZCA9PT0gdGlsZS5pZCkgcmV0dXJuO1xuICAgICAgLy8gSWYgdGhlIHRvb2x0aXAgaXMgb3BlbiwgY2xvc2UgaXRcbiAgICAgIC8vICFAVE9ETyAtIFNob3VsZCBvbmx5IGRldGFjaCBpZiB0aGUgbmV3IHRpbGUgaXMgb24gc2FtZSB0aWxlIGdyb3VwIGFzIHRoZSBsYXN0XG4gICAgICBpZiAodGhpcy50b29sdGlwUmVmKSB0aGlzLnRvb2x0aXBSZWYuZGV0YWNoKCk7XG4gICAgICAvLyBJZiB0aGUgdGlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBob3ZlcmVkIG9uIGlzIGRpZmZlcmVudCB0aGFuIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiwgXG4gICAgICAvLyB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgY29sb3IgYmFjayB0byB0aGUgb3JpZ2luYWwgY29sb3JcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgIT09IHRpbGUuaWQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuY29sb3I7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldCB0aGUgcmVmZXJlbmNlIHRvIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvblxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCA9IHRpbGU7XG5cbiAgICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uIHRvIHRoZSBob3ZlciBjb2xvclxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuaG92ZXJDb2xvcjtcblxuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMudG9vbHRpcE92ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpLmdsb2JhbCgpXG4gICAgICAudG9wKGAke2V2ZW50LmNsaWVudFkgKyAxNX1weGApXG4gICAgICAubGVmdChgJHtldmVudC5jbGllbnRYICsgMTV9cHhgKTtcblxuICAgICAgdGhpcy50b29sdGlwUmVmID0gdGhpcy50b29sdGlwT3ZlcmxheS5jcmVhdGUoe1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5LFxuICAgICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLnRvb2x0aXBPdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuY2xvc2UoKVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRvb2x0aXBDb21wb25lbnQgPSB0aGlzLnRvb2x0aXBSZWYuYXR0YWNoKHRoaXMudG9vbHRpcFBvcnRhbCk7XG4gICAgICB0b29sdGlwQ29tcG9uZW50Lmluc3RhbmNlLnRleHQgPSB0aWxlLnRvb2x0aXBUZXh0ID8/IHRpbGUuaWQudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXBpeGVsLWdyaWQtdG9vbHRpcCcsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1jb250ZW50XCI+e3t0ZXh0fX08L2Rpdj48L2Rpdj5gLFxuICBzdHlsZXM6IFtgLnRvb2x0aXAgeyAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsgY29sb3I6ICNmZmY7IHBhZGRpbmc6IDVweCAxMHB4OyBib3JkZXItcmFkaXVzOiA1cHg7IH1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQgeyBASW5wdXQoKSB0ZXh0ITogc3RyaW5nOyB9XG4iXX0=