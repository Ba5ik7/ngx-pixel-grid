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
        this.hasLoadedPixels = true;
        requestAnimationFrame(() => {
            this.tilesMatrix = this.pixelGridService.mergeTilesMatrix(this.tilesMatrix, tiles);
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
        this.time += (Math.sin(this.time) < 0 ? .3 : Math.cos(this.time) > 0.5 ? 0.3 : 0.8) * this.timeDelta;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7Ozs7QUFjdkIsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxZQUNVLE1BQWMsRUFDZCxnQkFBcUMsRUFDckMsY0FBdUI7UUFGdkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBcUI7UUFDckMsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFHdkIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRTFELG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBaUJ4QixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFtQmxFLGNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLFNBQUksR0FBRyxDQUFDLENBQUM7UUE2Q1QscUJBQWdCLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEYsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxD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SyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzlGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7O21IQTFGVSxxQkFBcUI7dUdBQXJCLHFCQUFxQixzV0FQdEI7OztTQUdIOzRGQUlJLHFCQUFxQjtrQkFUakMsU0FBUzsrQkFDRSxnQkFBZ0IsWUFDaEI7OztTQUdILG1CQUVVLHVCQUF1QixDQUFDLE1BQU07cUpBVXJDLFNBQVM7c0JBQWxCLE1BQU07Z0JBR00sTUFBTTtzQkFBbEIsS0FBSztnQkFRa0MseUJBQXlCO3NCQUFoRSxTQUFTO3VCQUFDLDJCQUEyQjtnQkFDUixlQUFlO3NCQUE1QyxTQUFTO3VCQUFDLGlCQUFpQjs7QUFzSTlCLE1BQU0sT0FBTyw0QkFBNEI7OzBIQUE1Qiw0QkFBNEI7OEdBQTVCLDRCQUE0Qix3RkFKN0Isd0VBQXdFOzRGQUl2RSw0QkFBNEI7a0JBTnhDLFNBQVM7K0JBQ0Usd0JBQXdCLFlBQ3hCLHdFQUF3RSxpQkFFbkUsaUJBQWlCLENBQUMsU0FBUzs4QkFFUyxJQUFJO3NCQUFaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBpeGVsR3JpZCB9IGZyb20gJy4vY2xhc3Nlcy9waXhlbC1ncmlkJztcbmltcG9ydCB7IElUaWxlLCBJVGlsZUNsaWNrRXZlbnQgfSBmcm9tICcuL2ludGVyZmFjZXMvbmd4LXBpeGVsLWdyaWQnO1xuaW1wb3J0IHsgTmd4UGl4ZWxHcmlkU2VydmljZSB9IGZyb20gJy4vbmd4LXBpeGVsLWdyaWQuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1waXhlbC1ncmlkJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiAjcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciBjbGFzcz1cInBpeGVsLWdyaWQtY2FudmFzLWNvbnRhaW5lclwiPlxuICAgIDxjYW52YXMgI3BpeGVsR3JpZENhbnZhcz48L2NhbnZhcz5cbiAgPC9kaXY+YCxcbiAgc3R5bGVzOiBbJy5waXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXIgeyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB9J10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE5neFBpeGVsR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBwaXhlbEdyaWRTZXJ2aWNlOiBOZ3hQaXhlbEdyaWRTZXJ2aWNlLFxuICAgIHByaXZhdGUgdG9vbHRpcE92ZXJsYXk6IE92ZXJsYXlcbiAgKSB7IH1cbiAgXG4gIEBPdXRwdXQoKSB0aWxlQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPElUaWxlQ2xpY2tFdmVudD4oKTtcblxuICBoYXNMb2FkZWRQaXhlbHMgPSBmYWxzZTtcbiAgQElucHV0KCkgc2V0IHBpeGVscyh0aWxlczogSVRpbGVbXSkge1xuICAgIGlmICghdGlsZXMgfHwgIXRpbGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIHRoaXMuaGFzTG9hZGVkUGl4ZWxzID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy50aWxlc01hdHJpeCA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5tZXJnZVRpbGVzTWF0cml4KHRoaXMudGlsZXNNYXRyaXgsIHRpbGVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIEBWaWV3Q2hpbGQoJ3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXInKSBwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3BpeGVsR3JpZENhbnZhcycpIHBpeGVsR3JpZENhbnZhcyE6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xuXG4gIGN0eCE6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcGl4ZWxHcmlkITogUGl4ZWxHcmlkO1xuICB0aWxlc01hdHJpeCE6IElUaWxlW11bXTtcblxuICB0b29sdGlwUmVmITogT3ZlcmxheVJlZjtcbiAgdG9vbHRpcFBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCk7XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7ICAgIFxuICAgIGNvbnN0IHsgcGl4ZWxHcmlkLCB0aWxlc01hdHJpeCB9ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmJ1aWxkVGlsZXNNYXRyaXgoKTtcbiAgICB0aGlzLnBpeGVsR3JpZCA9IHBpeGVsR3JpZDtcbiAgICB0aGlzLnRpbGVzTWF0cml4ID0gdGlsZXNNYXRyaXg7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmN0eCA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5jcmVhdGVDdHgodGhpcy50aWxlc01hdHJpeCwgY2FudmFzKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZU1vdXNlQ2xpY2spO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZSk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5oYW5kbGVNb3VzZU91dCk7XG4gICAgXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKSk7XG4gIH1cbiAgXG5cbiAgdGltZURlbHRhID0gMC4wMDUgKiAuMDU7XG4gIHRpbWUgPSAwO1xuICAvLyBzd2l0Y2hMYXlvdXQgPSB0cnVlO1xuICBsb29wKHRpbWVzdGFtcDogbnVtYmVyKTogdm9pZCB7XG4gICAgXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGgsIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0KTtcbiAgICAvLyB0aGlzLnRpbWUgKz0gdGhpcy50aW1lRGVsdGE7XG4gICAgdGhpcy50aW1lICs9IChNYXRoLnNpbih0aGlzLnRpbWUpIDwgMCA/IC4zIDogTWF0aC5jb3ModGhpcy50aW1lKSA+IDAuNSA/IDAuMyA6IDAuOCkgKiB0aGlzLnRpbWVEZWx0YTtcbiAgICBcbiAgICBpZiAodGhpcy50aW1lID4gMSkge1xuICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgIC8vIHRoaXMuc3dpdGNoTGF5b3V0ID0gIXRoaXMuc3dpdGNoTGF5b3V0O1xuICAgIH1cbiAgICAgIFxuICAgIHRoaXMucGl4ZWxHcmlkLnRpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICB0aWxlLnNvdXJjZUNvb3JkaW5hdGVzLnggPSB0aWxlLmNvb3JkaW5hdGVzLng7XG4gICAgICB0aWxlLnNvdXJjZUNvb3JkaW5hdGVzLnkgPSB0aWxlLmNvb3JkaW5hdGVzLnk7XG4gICAgfSk7XG5cblxuICAgIGxldCB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkLnRpbGVzO1xuICAgIGlmKHRoaXMuaGFzTG9hZGVkUGl4ZWxzKSB7XG4gICAgICB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5ncmlkTGF5b3V0KHRoaXMucGl4ZWxHcmlkLnRpbGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGlsZXMgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UucGh5bGxvdGF4aXNMYXlvdXQoXG4gICAgICAgIHRoaXMucGl4ZWxHcmlkLnRpbGVzLFxuICAgICAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoICogLjUsXG4gICAgICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ICogLjVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueCA9IHRpbGUuY29vcmRpbmF0ZXMueDtcbiAgICAgIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueSA9IHRpbGUuY29vcmRpbmF0ZXMueTtcbiAgICAgIHRpbGUuY29vcmRpbmF0ZXMueCA9IHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueCAqICgxIC0gdGhpcy50aW1lKSArIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueCAqIHRoaXMudGltZTtcbiAgICAgIHRpbGUuY29vcmRpbmF0ZXMueSA9IHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueSAqICgxIC0gdGhpcy50aW1lKSArIHRpbGUudGFyZ2V0Q29vcmRpbmF0ZXMueSAqIHRoaXMudGltZTtcbiAgICAgIGlmICh0aWxlLmlzUGl4ZWwpIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRpbGUuaW1nISwgdGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCArIDEsIHRpbGUuc2l6ZS5oZWlnaHQgKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRpbGUuY29sb3I7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGgsIHRpbGUuc2l6ZS5oZWlnaHQpO1xuICAgICAgfVxuICAgIH0pOyAgIFxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS53aGF0VGlsZUlzTW91c2VPdmVyKHRoaXMudGlsZXNNYXRyaXgsIHJlY3QsIGV2ZW50KTtcbiAgICB0aWxlICYmIHRoaXMudGlsZUNsaWNrLmVtaXQoeyBpZDogdGlsZS5pZCwgaHJlZjogdGlsZS5ocmVmID8/IHVuZGVmaW5lZCB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkKSB7XG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLm9wdGlvbnMudGlsZUNvbG9yO1xuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy50b29sdGlwUmVmLmRpc3Bvc2U/LigpO1xuICB9XG5cbiAgY3VycmVudFRpbGVCZWluZ0hvdmVyZWQ6IElUaWxlIHwgdW5kZWZpbmVkO1xuICBoYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLndoYXRUaWxlSXNNb3VzZU92ZXIodGhpcy50aWxlc01hdHJpeCwgcmVjdCwgZXZlbnQpO1xuICAgIGlmICh0aWxlKSB7XG4gICAgICAvLyBLaW5kIG9mIHRyaWNreSBoZXJlLCB3YW50IHRvIGxlYXZlIGNvbW1lbnQgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgIC8vIFdlIGFyZSBqdXN0IHRyeWluZyB0byBzd2FwIG91dCBjb2xvcnMgb2YgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uXG4gICAgICAvLyBTbyBhIHJlZmVybmNlIGlzIG1hZGUgdG8gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uIGFuZCB0aGUgY29sb3IgaXMgY2hhbmdlZFxuICAgICAgLy8gSWYgdGhlIHRpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgaG92ZXJlZCBvbiBpcyB0aGUgc2FtZSBhcyB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24sIHJldHVyblxuICAgICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgJiYgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5pZCA9PT0gdGlsZS5pZCkgcmV0dXJuO1xuICAgICAgLy8gSWYgdGhlIHRvb2x0aXAgaXMgb3BlbiwgY2xvc2UgaXRcbiAgICAgIC8vICFAVE9ETyAtIFNob3VsZCBvbmx5IGRldGFjaCBpZiB0aGUgbmV3IHRpbGUgaXMgb24gc2FtZSB0aWxlIGdyb3VwIGFzIHRoZSBsYXN0XG4gICAgICBpZiAodGhpcy50b29sdGlwUmVmKSB0aGlzLnRvb2x0aXBSZWYuZGV0YWNoKCk7XG4gICAgICAvLyBJZiB0aGUgdGlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBob3ZlcmVkIG9uIGlzIGRpZmZlcmVudCB0aGFuIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiwgXG4gICAgICAvLyB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgY29sb3IgYmFjayB0byB0aGUgb3JpZ2luYWwgY29sb3JcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgIT09IHRpbGUuaWQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuY29sb3I7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldCB0aGUgcmVmZXJlbmNlIHRvIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvblxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCA9IHRpbGU7XG5cbiAgICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uIHRvIHRoZSBob3ZlciBjb2xvclxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuaG92ZXJDb2xvcjtcblxuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMudG9vbHRpcE92ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpLmdsb2JhbCgpXG4gICAgICAudG9wKGAke2V2ZW50LmNsaWVudFkgKyAxNX1weGApXG4gICAgICAubGVmdChgJHtldmVudC5jbGllbnRYICsgMTV9cHhgKTtcblxuICAgICAgdGhpcy50b29sdGlwUmVmID0gdGhpcy50b29sdGlwT3ZlcmxheS5jcmVhdGUoe1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5LFxuICAgICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLnRvb2x0aXBPdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuY2xvc2UoKVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRvb2x0aXBDb21wb25lbnQgPSB0aGlzLnRvb2x0aXBSZWYuYXR0YWNoKHRoaXMudG9vbHRpcFBvcnRhbCk7XG4gICAgICB0b29sdGlwQ29tcG9uZW50Lmluc3RhbmNlLnRleHQgPSB0aWxlLnRvb2x0aXBUZXh0ID8/IHRpbGUuaWQudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXBpeGVsLWdyaWQtdG9vbHRpcCcsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1jb250ZW50XCI+e3t0ZXh0fX08L2Rpdj48L2Rpdj5gLFxuICBzdHlsZXM6IFtgLnRvb2x0aXAgeyAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsgY29sb3I6ICNmZmY7IHBhZGRpbmc6IDVweCAxMHB4OyBib3JkZXItcmFkaXVzOiA1cHg7IH1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQgeyBASW5wdXQoKSB0ZXh0ITogc3RyaW5nOyB9XG4iXX0=