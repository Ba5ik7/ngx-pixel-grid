import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-pixel-grid.service";
import * as i2 from "@angular/cdk/overlay";
const _c0 = ["pixelGridCanvasContatiner"];
const _c1 = ["pixelGridCanvas"];
export class NgxPixelGridComponent {
    constructor(ngZone, pixelGridService, tooltipOverlay) {
        this.ngZone = ngZone;
        this.pixelGridService = pixelGridService;
        this.tooltipOverlay = tooltipOverlay;
        this.tileClick = new EventEmitter();
        this.handleMouseClick = (event) => {
            const tile = this.whatTileIsMouseOver(event);
            if (tile)
                this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
        };
        this.tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
        this.handleMouseMove = (event) => {
            const tile = this.whatTileIsMouseOver(event);
            if (tile) {
                // If the tile is the same as the one being hovered, do nothing
                if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id)
                    return;
                // If there is a tile being hovered, reset its color
                if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
                    this.currentTileBeingHovered.color = tile.color;
                }
                // If there is a tooltip being shown, destroy it
                if (this.tooltipRef)
                    this.tooltipRef.detach();
                // Set the new tile being hovered
                this.currentTileBeingHovered = tile;
                this.currentTileBeingHovered.color = tile.hoverColor;
                // Create the tooltip strategy
                const positionStrategy = this.tooltipOverlay.position().global();
                positionStrategy.top(`${event.clientY + 15}px`).left(`${event.clientX + 15}px`);
                this.tooltipRef = this.tooltipOverlay.create({
                    positionStrategy,
                    hasBackdrop: false,
                    scrollStrategy: this.tooltipOverlay.scrollStrategies.reposition()
                });
                // Create the tooltip component
                const tooltipComponent = this.tooltipRef.attach(this.tooltipPortal);
                tooltipComponent.instance.text = tile.tooltipText ?? tile.id.toString();
            }
        };
        this.handleMouseOut = () => {
            // Clean up
            if (this.currentTileBeingHovered)
                this.currentTileBeingHovered.color = this.pixelGridService.tileColor;
            if (this.tooltipRef)
                this.tooltipRef.dispose();
        };
    }
    set pixels(tiles) {
        if (!tiles || !tiles.length)
            return;
        this.pixelGridTilesMatrix = this.pixelGridService.mergeTilesMatrix(this.pixelGridTilesMatrix, tiles);
    }
    onResize() {
        const pixelGridSize = this.getPixelGridSize(this.pixelGridTilesMatrix, this.pixelGrid.gutter);
        this.pixelGridCanvas.nativeElement.width = pixelGridSize.width;
        this.pixelGridCanvas.nativeElement.height = pixelGridSize.height;
    }
    ngAfterViewInit() {
        this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d');
        this.pixelGridCanvasContatiner.nativeElement.style.cursor = 'pointer';
        this.pixelGridCanvas.nativeElement.addEventListener('click', this.handleMouseClick);
        this.pixelGridCanvas.nativeElement.addEventListener('mousemove', this.handleMouseMove);
        this.pixelGridCanvas.nativeElement.addEventListener('mouseout', this.handleMouseOut);
        this.pixelGrid = new PixelGrid(this.pixelGridService.columns, this.pixelGridService.rows, this.pixelGridService.gutter);
        this.pixelGridTilesMatrix = this.pixelGrid.buildTilesMatrix(this.pixelGridService.tileSize, this.pixelGridService.tileColor, this.pixelGridService.tileHoverColor);
        this.onResize();
        this.ngZone.runOutsideAngular(() => this.loop());
    }
    loop() {
        this.pixelGridTilesMatrix.forEach(row => {
            row.forEach(tile => {
                // If the tile is a pixel, then paint base64 image to the ctx
                if (tile.isPixel) {
                    const img = new Image();
                    img.src = tile.img;
                    this.ctx.drawImage(img, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
                    return;
                }
                else {
                    this.ctx.fillStyle = tile.color;
                    this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
                }
            });
        });
        requestAnimationFrame(() => this.loop());
    }
    getPixelGridSize(pixelGridTilesMatrix, gutter) {
        const width = pixelGridTilesMatrix[0].length * pixelGridTilesMatrix[0][0].size.width + (pixelGridTilesMatrix[0].length - 1) * gutter;
        const height = pixelGridTilesMatrix.length * pixelGridTilesMatrix[0][0].size.height + (pixelGridTilesMatrix.length - 1) * gutter;
        return { width, height };
    }
    whatTileIsMouseOver(event) {
        const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let returnTile = undefined;
        for (let i = 0; i < this.pixelGridTilesMatrix.length; i++) {
            for (let j = 0; j < this.pixelGridTilesMatrix[i].length; j++) {
                const tile = this.pixelGridTilesMatrix[i][j];
                if (x >= tile.coordinates.x && x <= tile.coordinates.x + tile.size.width &&
                    y >= tile.coordinates.y && y <= tile.coordinates.y + tile.size.height) {
                    returnTile = tile;
                }
            }
        }
        return returnTile;
    }
}
NgxPixelGridComponent.ɵfac = function NgxPixelGridComponent_Factory(t) { return new (t || NgxPixelGridComponent)(i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i1.NgxPixelGridService), i0.ɵɵdirectiveInject(i2.Overlay)); };
NgxPixelGridComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NgxPixelGridComponent, selectors: [["ngx-pixel-grid"]], viewQuery: function NgxPixelGridComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 5);
        i0.ɵɵviewQuery(_c1, 5);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pixelGridCanvasContatiner = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pixelGridCanvas = _t.first);
    } }, hostBindings: function NgxPixelGridComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("resize", function NgxPixelGridComponent_resize_HostBindingHandler() { return ctx.onResize(); }, false, i0.ɵɵresolveWindow);
    } }, inputs: { pixels: "pixels" }, outputs: { tileClick: "tileClick" }, decls: 4, vars: 0, consts: [[1, "pixel-grid-canvas-container"], ["pixelGridCanvasContatiner", ""], ["pixelGridCanvas", ""]], template: function NgxPixelGridComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵelement(2, "canvas", null, 2);
        i0.ɵɵelementEnd();
    } }, styles: [".pixel-grid-canvas-container[_ngcontent-%COMP%]{width:100%;height:100%}"], changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelGridComponent, [{
        type: Component,
        args: [{ selector: 'ngx-pixel-grid', template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".pixel-grid-canvas-container{width:100%;height:100%}\n"] }]
    }], function () { return [{ type: i0.NgZone }, { type: i1.NgxPixelGridService }, { type: i2.Overlay }]; }, { tileClick: [{
            type: Output
        }], pixels: [{
            type: Input
        }], pixelGridCanvasContatiner: [{
            type: ViewChild,
            args: ['pixelGridCanvasContatiner']
        }], pixelGridCanvas: [{
            type: ViewChild,
            args: ['pixelGridCanvas']
        }], onResize: [{
            type: HostListener,
            args: ['window:resize']
        }] }); })();
export class NgxPixelGridTooltipComponent {
}
NgxPixelGridTooltipComponent.ɵfac = function NgxPixelGridTooltipComponent_Factory(t) { return new (t || NgxPixelGridTooltipComponent)(); };
NgxPixelGridTooltipComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NgxPixelGridTooltipComponent, selectors: [["ngx-pixel-grid-tooltip"]], inputs: { text: "text" }, decls: 3, vars: 1, consts: [[1, "tooltip"], [1, "tooltip-content"]], template: function NgxPixelGridTooltipComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
        i0.ɵɵtext(2);
        i0.ɵɵelementEnd()();
    } if (rf & 2) {
        i0.ɵɵadvance(2);
        i0.ɵɵtextInterpolate(ctx.text);
    } }, styles: ["[_nghost-%COMP%], .tooltip[_ngcontent-%COMP%]{pointer-events:none}.tooltip[_ngcontent-%COMP%]{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelGridTooltipComponent, [{
        type: Component,
        args: [{ selector: 'ngx-pixel-grid-tooltip', template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, styles: [":host,.tooltip{pointer-events:none}.tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] }]
    }], null, { text: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7QUFhakQsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxZQUNVLE1BQWMsRUFDZCxnQkFBcUMsRUFDckMsY0FBdUI7UUFGdkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBcUI7UUFDckMsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFHdkIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBMEYxRCxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsSUFBSSxJQUFJO2dCQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUE7UUFHRCxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDbEUsb0JBQWUsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN0QyxNQUFN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QkFDdEUsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDckUsVUFBVSxHQUFHLElBQUksQ0FBQztpQkFDbkI7YUFDSjtTQUNGO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQzs7MEZBaEdVLHFCQUFxQjt3RUFBckIscUJBQXFCOzs7Ozs7OztvR0FBckIsY0FBVTs7UUFOckIsaUNBQW9FO1FBQ2xFLGtDQUFrQztRQUNwQyxpQkFBTTs7dUZBSUsscUJBQXFCO2NBVGpDLFNBQVM7MkJBQ0UsZ0JBQWdCLFlBQ2hCOzs7U0FHSCxtQkFFVSx1QkFBdUIsQ0FBQyxNQUFNO2lIQVVyQyxTQUFTO2tCQUFsQixNQUFNO1lBRU0sTUFBTTtrQkFBbEIsS0FBSztZQVFrQyx5QkFBeUI7a0JBQWhFLFNBQVM7bUJBQUMsMkJBQTJCO1lBQ1IsZUFBZTtrQkFBNUMsU0FBUzttQkFBQyxpQkFBaUI7WUFTNUIsUUFBUTtrQkFEUCxZQUFZO21CQUFDLGVBQWU7O0FBa0kvQixNQUFNLE9BQU8sNEJBQTRCOzt3R0FBNUIsNEJBQTRCOytFQUE1Qiw0QkFBNEI7UUFYNUIsOEJBQXFCLGFBQUE7UUFBNkIsWUFBUTtRQUFBLGlCQUFNLEVBQUE7O1FBQWQsZUFBUTtRQUFSLDhCQUFROzt1RkFXMUQsNEJBQTRCO2NBYnhDLFNBQVM7MkJBQ0Usd0JBQXdCLFlBQ3hCLHdFQUF3RTtnQkFZekUsSUFBSTtrQkFBWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGl4ZWxHcmlkIH0gZnJvbSAnLi9jbGFzc2VzL3BpeGVsLWdyaWQnO1xuaW1wb3J0IHsgSVNpemUsIElUaWxlLCBJVGlsZUNsaWNrRXZlbnQgfSBmcm9tICcuL2ludGVyZmFjZXMvbmd4LXBpeGVsLWdyaWQnO1xuaW1wb3J0IHsgTmd4UGl4ZWxHcmlkU2VydmljZSB9IGZyb20gJy4vbmd4LXBpeGVsLWdyaWQuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1waXhlbC1ncmlkJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiAjcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciBjbGFzcz1cInBpeGVsLWdyaWQtY2FudmFzLWNvbnRhaW5lclwiPlxuICAgIDxjYW52YXMgI3BpeGVsR3JpZENhbnZhcz48L2NhbnZhcz5cbiAgPC9kaXY+YCxcbiAgc3R5bGVzOiBbJy5waXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXIgeyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB9J10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE5neFBpeGVsR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBwaXhlbEdyaWRTZXJ2aWNlOiBOZ3hQaXhlbEdyaWRTZXJ2aWNlLFxuICAgIHByaXZhdGUgdG9vbHRpcE92ZXJsYXk6IE92ZXJsYXlcbiAgKSB7IH1cbiAgXG4gIEBPdXRwdXQoKSB0aWxlQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPElUaWxlQ2xpY2tFdmVudD4oKTtcblxuICBASW5wdXQoKSBzZXQgcGl4ZWxzKHRpbGVzOiBJVGlsZVtdKSB7XG4gICAgaWYgKCF0aWxlcyB8fCAhdGlsZXMubGVuZ3RoKSByZXR1cm47XG4gICAgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeCA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5tZXJnZVRpbGVzTWF0cml4KFxuICAgICAgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeCxcbiAgICAgIHRpbGVzXG4gICAgKTtcbiAgfVxuXG4gIEBWaWV3Q2hpbGQoJ3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXInKSBwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3BpeGVsR3JpZENhbnZhcycpIHBpeGVsR3JpZENhbnZhcyE6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xuXG4gIGN0eCE6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcGl4ZWxHcmlkITogUGl4ZWxHcmlkO1xuICBwaXhlbEdyaWRUaWxlc01hdHJpeCE6IElUaWxlW11bXTtcblxuICB0b29sdGlwUmVmITogT3ZlcmxheVJlZjtcblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgb25SZXNpemUoKSB7XG4gICAgY29uc3QgcGl4ZWxHcmlkU2l6ZSA9IHRoaXMuZ2V0UGl4ZWxHcmlkU2l6ZSh0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4LCB0aGlzLnBpeGVsR3JpZC5ndXR0ZXIpO1xuICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggPSBwaXhlbEdyaWRTaXplLndpZHRoO1xuICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gcGl4ZWxHcmlkU2l6ZS5oZWlnaHQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jdHggPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJykhO1xuXG4gICAgdGhpcy5waXhlbEdyaWRDYW52YXNDb250YXRpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZU1vdXNlQ2xpY2spO1xuICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmUpO1xuICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmhhbmRsZU1vdXNlT3V0KTtcblxuICAgIHRoaXMucGl4ZWxHcmlkID0gbmV3IFBpeGVsR3JpZChcbiAgICAgIHRoaXMucGl4ZWxHcmlkU2VydmljZS5jb2x1bW5zLFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLnJvd3MsXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuZ3V0dGVyXG4gICAgKTtcbiAgICB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4ID0gdGhpcy5waXhlbEdyaWQuYnVpbGRUaWxlc01hdHJpeChcbiAgICAgIHRoaXMucGl4ZWxHcmlkU2VydmljZS50aWxlU2l6ZSxcbiAgICAgIHRoaXMucGl4ZWxHcmlkU2VydmljZS50aWxlQ29sb3IsXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UudGlsZUhvdmVyQ29sb3JcbiAgICApO1xuXG4gICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMubG9vcCgpKTtcbiAgfVxuICBcbiAgbG9vcCgpIHtcbiAgICB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4LmZvckVhY2gocm93ID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICAvLyBJZiB0aGUgdGlsZSBpcyBhIHBpeGVsLCB0aGVuIHBhaW50IGJhc2U2NCBpbWFnZSB0byB0aGUgY3R4XG4gICAgICAgIGlmICh0aWxlLmlzUGl4ZWwpIHtcbiAgICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICBpbWcuc3JjID0gdGlsZS5pbWchO1xuICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGggKyAxLCB0aWxlLnNpemUuaGVpZ2h0ICsgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRpbGUuY29sb3I7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QodGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCwgdGlsZS5zaXplLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmxvb3AoKSk7XG4gIH1cblxuICBnZXRQaXhlbEdyaWRTaXplKHBpeGVsR3JpZFRpbGVzTWF0cml4OiBJVGlsZVtdW10sIGd1dHRlcjogbnVtYmVyKTogSVNpemUge1xuICAgIGNvbnN0IHdpZHRoID0gcGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF0ubGVuZ3RoICogcGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF1bMF0uc2l6ZS53aWR0aCArIChwaXhlbEdyaWRUaWxlc01hdHJpeFswXS5sZW5ndGggLSAxKSAqIGd1dHRlcjtcbiAgICBjb25zdCBoZWlnaHQgPSBwaXhlbEdyaWRUaWxlc01hdHJpeC5sZW5ndGggKiBwaXhlbEdyaWRUaWxlc01hdHJpeFswXVswXS5zaXplLmhlaWdodCArIChwaXhlbEdyaWRUaWxlc01hdHJpeC5sZW5ndGggLSAxKSAqIGd1dHRlcjtcbiAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICB3aGF0VGlsZUlzTW91c2VPdmVyKGV2ZW50OiBNb3VzZUV2ZW50KTogSVRpbGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgbGV0IHJldHVyblRpbGUgPSB1bmRlZmluZWQ7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvcihsZXQgaiA9IDA7IGogPCB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4W2ldW2pdO1xuICAgICAgICBpZiAoeCA+PSB0aWxlLmNvb3JkaW5hdGVzLnggJiYgeCA8PSB0aWxlLmNvb3JkaW5hdGVzLnggKyB0aWxlLnNpemUud2lkdGggJiZcbiAgICAgICAgICB5ID49IHRpbGUuY29vcmRpbmF0ZXMueSAmJiB5IDw9IHRpbGUuY29vcmRpbmF0ZXMueSArIHRpbGUuc2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVyblRpbGUgPSB0aWxlO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHVyblRpbGU7XG4gIH1cblxuICBoYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMud2hhdFRpbGVJc01vdXNlT3ZlcihldmVudCk7XG4gICAgaWYgKHRpbGUpIHRoaXMudGlsZUNsaWNrLmVtaXQoeyBpZDogdGlsZS5pZCwgaHJlZjogdGlsZS5ocmVmID8/IHVuZGVmaW5lZCB9KTtcbiAgfVxuXG4gIGN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkOiBJVGlsZSB8IHVuZGVmaW5lZDtcbiAgdG9vbHRpcFBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCk7XG4gIGhhbmRsZU1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLndoYXRUaWxlSXNNb3VzZU92ZXIoZXZlbnQpO1xuICAgIGlmICh0aWxlKSB7XG4gICAgICAvLyBJZiB0aGUgdGlsZSBpcyB0aGUgc2FtZSBhcyB0aGUgb25lIGJlaW5nIGhvdmVyZWQsIGRvIG5vdGhpbmdcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgPT09IHRpbGUuaWQpIHJldHVybjtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgdGlsZSBiZWluZyBob3ZlcmVkLCByZXNldCBpdHMgY29sb3JcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgIT09IHRpbGUuaWQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuY29sb3I7XG4gICAgICB9XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHRvb2x0aXAgYmVpbmcgc2hvd24sIGRlc3Ryb3kgaXRcbiAgICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kZXRhY2goKTtcbiAgICAgIFxuICAgICAgLy8gU2V0IHRoZSBuZXcgdGlsZSBiZWluZyBob3ZlcmVkXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkID0gdGlsZTtcbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmhvdmVyQ29sb3I7XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgdG9vbHRpcCBzdHJhdGVneVxuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMudG9vbHRpcE92ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKTtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kudG9wKGAke2V2ZW50LmNsaWVudFkgKyAxNX1weGApLmxlZnQoYCR7ZXZlbnQuY2xpZW50WCArIDE1fXB4YCk7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSB0aGlzLnRvb2x0aXBPdmVybGF5LmNyZWF0ZSh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3ksXG4gICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMudG9vbHRpcE92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKClcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIHRvb2x0aXAgY29tcG9uZW50XG4gICAgICBjb25zdCB0b29sdGlwQ29tcG9uZW50ID0gdGhpcy50b29sdGlwUmVmLmF0dGFjaCh0aGlzLnRvb2x0aXBQb3J0YWwpO1xuICAgICAgdG9vbHRpcENvbXBvbmVudC5pbnN0YW5jZS50ZXh0ID0gdGlsZS50b29sdGlwVGV4dCA/PyB0aWxlLmlkLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgLy8gQ2xlYW4gdXBcbiAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCkgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS50aWxlQ29sb3I7XG4gICAgaWYgKHRoaXMudG9vbHRpcFJlZikgdGhpcy50b29sdGlwUmVmLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1waXhlbC1ncmlkLXRvb2x0aXAnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtY29udGVudFwiPnt7dGV4dH19PC9kaXY+PC9kaXY+YCxcbiAgc3R5bGVzOiBbYFxuICAgIDpob3N0LCAudG9vbHRpcCB7IHBvaW50ZXItZXZlbnRzOiBub25lOyB9XG4gICAgLnRvb2x0aXAgeyBcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG4gICAgICBjb2xvcjogI2ZmZjtcbiAgICAgIHBhZGRpbmc6IDVweCAxMHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICB9XG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRUb29sdGlwQ29tcG9uZW50IHtcbiAgQElucHV0KCkgdGV4dCE6IHN0cmluZztcbn0iXX0=