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
        this.ctx.save();
        // this.ctx.clearRect(0, 0, this.pixelGridCanvas.nativeElement.width, this.pixelGridCanvas.nativeElement.height);
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
        this.ctx.restore();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7QUFhakQsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxZQUNVLE1BQWMsRUFDZCxnQkFBcUMsRUFDckMsY0FBdUI7UUFGdkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBcUI7UUFDckMsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFHdkIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBZ0cxRCxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsSUFBSSxJQUFJO2dCQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUE7UUFHRCxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDbEUsb0JBQWUsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN0QyxNQUFN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QUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO29CQUN0RSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNyRSxVQUFVLEdBQUcsSUFBSSxDQUFDO2lCQUNuQjthQUNKO1NBQ0Y7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDOzswRkF0R1UscUJBQXFCO3dFQUFyQixxQkFBcUI7Ozs7Ozs7O29HQUFyQixjQUFVOztRQU5yQixpQ0FBb0U7UUFDbEUsa0NBQWtDO1FBQ3BDLGlCQUFNOzt1RkFJSyxxQkFBcUI7Y0FUakMsU0FBUzsyQkFDRSxnQkFBZ0IsWUFDaEI7OztTQUdILG1CQUVVLHVCQUF1QixDQUFDLE1BQU07aUhBVXJDLFNBQVM7a0JBQWxCLE1BQU07WUFFTSxNQUFNO2tCQUFsQixLQUFLO1lBUWtDLHlCQUF5QjtrQkFBaEUsU0FBUzttQkFBQywyQkFBMkI7WUFDUixlQUFlO2tCQUE1QyxTQUFTO21CQUFDLGlCQUFpQjtZQVM1QixRQUFRO2tCQURQLFlBQVk7bUJBQUMsZUFBZTs7QUF3SS9CLE1BQU0sT0FBTyw0QkFBNEI7O3dHQUE1Qiw0QkFBNEI7K0VBQTVCLDRCQUE0QjtRQVg1Qiw4QkFBcUIsYUFBQTtRQUE2QixZQUFRO1FBQUEsaUJBQU0sRUFBQTs7UUFBZCxlQUFRO1FBQVIsOEJBQVE7O3VGQVcxRCw0QkFBNEI7Y0FieEMsU0FBUzsyQkFDRSx3QkFBd0IsWUFDeEIsd0VBQXdFO2dCQVl6RSxJQUFJO2tCQUFaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQaXhlbEdyaWQgfSBmcm9tICcuL2NsYXNzZXMvcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBJU2l6ZSwgSVRpbGUsIElUaWxlQ2xpY2tFdmVudCB9IGZyb20gJy4vaW50ZXJmYWNlcy9uZ3gtcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBOZ3hQaXhlbEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtcGl4ZWwtZ3JpZC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXBpeGVsLWdyaWQnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2ICNwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyIGNsYXNzPVwicGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyXCI+XG4gICAgPGNhbnZhcyAjcGl4ZWxHcmlkQ2FudmFzPjwvY2FudmFzPlxuICA8L2Rpdj5gLFxuICBzdHlsZXM6IFsnLnBpeGVsLWdyaWQtY2FudmFzLWNvbnRhaW5lciB7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IH0nXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHBpeGVsR3JpZFNlcnZpY2U6IE5neFBpeGVsR3JpZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b29sdGlwT3ZlcmxheTogT3ZlcmxheVxuICApIHsgfVxuICBcbiAgQE91dHB1dCgpIHRpbGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SVRpbGVDbGlja0V2ZW50PigpO1xuXG4gIEBJbnB1dCgpIHNldCBwaXhlbHModGlsZXM6IElUaWxlW10pIHtcbiAgICBpZiAoIXRpbGVzIHx8ICF0aWxlcy5sZW5ndGgpIHJldHVybjtcbiAgICB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLm1lcmdlVGlsZXNNYXRyaXgoXG4gICAgICB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4LFxuICAgICAgdGlsZXNcbiAgICApO1xuICB9XG5cbiAgQFZpZXdDaGlsZCgncGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lcicpIHBpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncGl4ZWxHcmlkQ2FudmFzJykgcGl4ZWxHcmlkQ2FudmFzITogRWxlbWVudFJlZjxIVE1MQ2FudmFzRWxlbWVudD47XG5cbiAgY3R4ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwaXhlbEdyaWQhOiBQaXhlbEdyaWQ7XG4gIHBpeGVsR3JpZFRpbGVzTWF0cml4ITogSVRpbGVbXVtdO1xuXG4gIHRvb2x0aXBSZWYhOiBPdmVybGF5UmVmO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBvblJlc2l6ZSgpIHtcbiAgICBjb25zdCBwaXhlbEdyaWRTaXplID0gdGhpcy5nZXRQaXhlbEdyaWRTaXplKHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXgsIHRoaXMucGl4ZWxHcmlkLmd1dHRlcik7XG4gICAgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCA9IHBpeGVsR3JpZFNpemUud2lkdGg7XG4gICAgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgPSBwaXhlbEdyaWRTaXplLmhlaWdodDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmN0eCA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKSE7XG5cbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIubmF0aXZlRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlTW91c2VDbGljayk7XG4gICAgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZSk7XG4gICAgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMuaGFuZGxlTW91c2VPdXQpO1xuXG4gICAgdGhpcy5waXhlbEdyaWQgPSBuZXcgUGl4ZWxHcmlkKFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmNvbHVtbnMsXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uucm93cyxcbiAgICAgIHRoaXMucGl4ZWxHcmlkU2VydmljZS5ndXR0ZXJcbiAgICApO1xuICAgIHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXggPSB0aGlzLnBpeGVsR3JpZC5idWlsZFRpbGVzTWF0cml4KFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLnRpbGVTaXplLFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLnRpbGVDb2xvcixcbiAgICAgIHRoaXMucGl4ZWxHcmlkU2VydmljZS50aWxlSG92ZXJDb2xvclxuICAgICk7XG5cbiAgICB0aGlzLm9uUmVzaXplKCk7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5sb29wKCkpO1xuICB9XG4gIFxuICBsb29wKCkge1xuICAgIFxuICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAvLyB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCwgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQpO1xuXG4gICAgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeC5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICByb3cuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgICAgLy8gSWYgdGhlIHRpbGUgaXMgYSBwaXhlbCwgdGhlbiBwYWludCBiYXNlNjQgaW1hZ2UgdG8gdGhlIGN0eFxuICAgICAgICBpZiAodGlsZS5pc1BpeGVsKSB7XG4gICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgaW1nLnNyYyA9IHRpbGUuaW1nITtcbiAgICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCB0aWxlLmNvb3JkaW5hdGVzLngsIHRpbGUuY29vcmRpbmF0ZXMueSwgdGlsZS5zaXplLndpZHRoICsgMSwgdGlsZS5zaXplLmhlaWdodCArIDEpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aWxlLmNvbG9yO1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGgsIHRpbGUuc2l6ZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5sb29wKCkpO1xuICB9XG5cbiAgZ2V0UGl4ZWxHcmlkU2l6ZShwaXhlbEdyaWRUaWxlc01hdHJpeDogSVRpbGVbXVtdLCBndXR0ZXI6IG51bWJlcik6IElTaXplIHtcbiAgICBjb25zdCB3aWR0aCA9IHBpeGVsR3JpZFRpbGVzTWF0cml4WzBdLmxlbmd0aCAqIHBpeGVsR3JpZFRpbGVzTWF0cml4WzBdWzBdLnNpemUud2lkdGggKyAocGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF0ubGVuZ3RoIC0gMSkgKiBndXR0ZXI7XG4gICAgY29uc3QgaGVpZ2h0ID0gcGl4ZWxHcmlkVGlsZXNNYXRyaXgubGVuZ3RoICogcGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF1bMF0uc2l6ZS5oZWlnaHQgKyAocGl4ZWxHcmlkVGlsZXNNYXRyaXgubGVuZ3RoIC0gMSkgKiBndXR0ZXI7XG4gICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgd2hhdFRpbGVJc01vdXNlT3ZlcihldmVudDogTW91c2VFdmVudCk6IElUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgIGxldCByZXR1cm5UaWxlID0gdW5kZWZpbmVkO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IobGV0IGogPSAwOyBqIDwgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeFtpXVtqXTtcbiAgICAgICAgaWYgKHggPj0gdGlsZS5jb29yZGluYXRlcy54ICYmIHggPD0gdGlsZS5jb29yZGluYXRlcy54ICsgdGlsZS5zaXplLndpZHRoICYmXG4gICAgICAgICAgeSA+PSB0aWxlLmNvb3JkaW5hdGVzLnkgJiYgeSA8PSB0aWxlLmNvb3JkaW5hdGVzLnkgKyB0aWxlLnNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm5UaWxlID0gdGlsZTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXR1cm5UaWxlO1xuICB9XG5cbiAgaGFuZGxlTW91c2VDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLndoYXRUaWxlSXNNb3VzZU92ZXIoZXZlbnQpO1xuICAgIGlmICh0aWxlKSB0aGlzLnRpbGVDbGljay5lbWl0KHsgaWQ6IHRpbGUuaWQsIGhyZWY6IHRpbGUuaHJlZiA/PyB1bmRlZmluZWQgfSk7XG4gIH1cblxuICBjdXJyZW50VGlsZUJlaW5nSG92ZXJlZDogSVRpbGUgfCB1bmRlZmluZWQ7XG4gIHRvb2x0aXBQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQpO1xuICBoYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB0aWxlID0gdGhpcy53aGF0VGlsZUlzTW91c2VPdmVyKGV2ZW50KTtcbiAgICBpZiAodGlsZSkge1xuICAgICAgLy8gSWYgdGhlIHRpbGUgaXMgdGhlIHNhbWUgYXMgdGhlIG9uZSBiZWluZyBob3ZlcmVkLCBkbyBub3RoaW5nXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkID09PSB0aWxlLmlkKSByZXR1cm47XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHRpbGUgYmVpbmcgaG92ZXJlZCwgcmVzZXQgaXRzIGNvbG9yXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkICE9PSB0aWxlLmlkKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmNvbG9yO1xuICAgICAgfVxuICAgICAgLy8gSWYgdGhlcmUgaXMgYSB0b29sdGlwIGJlaW5nIHNob3duLCBkZXN0cm95IGl0XG4gICAgICBpZiAodGhpcy50b29sdGlwUmVmKSB0aGlzLnRvb2x0aXBSZWYuZGV0YWNoKCk7XG4gICAgICBcbiAgICAgIC8vIFNldCB0aGUgbmV3IHRpbGUgYmVpbmcgaG92ZXJlZFxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCA9IHRpbGU7XG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5ob3ZlckNvbG9yO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIHRvb2x0aXAgc3RyYXRlZ3lcbiAgICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLnRvb2x0aXBPdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCk7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LnRvcChgJHtldmVudC5jbGllbnRZICsgMTV9cHhgKS5sZWZ0KGAke2V2ZW50LmNsaWVudFggKyAxNX1weGApO1xuICAgICAgdGhpcy50b29sdGlwUmVmID0gdGhpcy50b29sdGlwT3ZlcmxheS5jcmVhdGUoe1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5LFxuICAgICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLnRvb2x0aXBPdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpXG4gICAgICB9KTtcblxuICAgICAgLy8gQ3JlYXRlIHRoZSB0b29sdGlwIGNvbXBvbmVudFxuICAgICAgY29uc3QgdG9vbHRpcENvbXBvbmVudCA9IHRoaXMudG9vbHRpcFJlZi5hdHRhY2godGhpcy50b29sdGlwUG9ydGFsKTtcbiAgICAgIHRvb2x0aXBDb21wb25lbnQuaW5zdGFuY2UudGV4dCA9IHRpbGUudG9vbHRpcFRleHQgPz8gdGlsZS5pZC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIC8vIENsZWFuIHVwXG4gICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQpIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UudGlsZUNvbG9yO1xuICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kaXNwb3NlKCk7XG4gIH1cbn1cblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZC10b29sdGlwJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRlbnRcIj57e3RleHR9fTwvZGl2PjwvZGl2PmAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCwgLnRvb2x0aXAgeyBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAgIC50b29sdGlwIHsgXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICAgICAgY29sb3I6ICNmZmY7XG4gICAgICBwYWRkaW5nOiA1cHggMTBweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgfVxuICBgXSxcbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIHRleHQhOiBzdHJpbmc7XG59Il19