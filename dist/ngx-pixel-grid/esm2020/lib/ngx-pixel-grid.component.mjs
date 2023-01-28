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
        this.ctx.clearRect(0, 0, this.pixelGridCanvas.nativeElement.width, this.pixelGridCanvas.nativeElement.height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7QUFhakQsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxZQUNVLE1BQWMsRUFDZCxnQkFBcUMsRUFDckMsY0FBdUI7UUFGdkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBcUI7UUFDckMsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFHdkIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBZ0cxRCxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsSUFBSSxJQUFJO2dCQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUE7UUFHRCxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDbEUsb0JBQWUsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN0QyxNQUFN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Z0JBWXpFLElBQUk7a0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBpeGVsR3JpZCB9IGZyb20gJy4vY2xhc3Nlcy9waXhlbC1ncmlkJztcbmltcG9ydCB7IElTaXplLCBJVGlsZSwgSVRpbGVDbGlja0V2ZW50IH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcbmltcG9ydCB7IE5neFBpeGVsR3JpZFNlcnZpY2UgfSBmcm9tICcuL25neC1waXhlbC1ncmlkLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZCcsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIgY2xhc3M9XCJwaXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXJcIj5cbiAgICA8Y2FudmFzICNwaXhlbEdyaWRDYW52YXM+PC9jYW52YXM+XG4gIDwvZGl2PmAsXG4gIHN0eWxlczogWycucGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgfSddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGl4ZWxHcmlkU2VydmljZTogTmd4UGl4ZWxHcmlkU2VydmljZSxcbiAgICBwcml2YXRlIHRvb2x0aXBPdmVybGF5OiBPdmVybGF5XG4gICkgeyB9XG4gIFxuICBAT3V0cHV0KCkgdGlsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxJVGlsZUNsaWNrRXZlbnQ+KCk7XG5cbiAgQElucHV0KCkgc2V0IHBpeGVscyh0aWxlczogSVRpbGVbXSkge1xuICAgIGlmICghdGlsZXMgfHwgIXRpbGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UubWVyZ2VUaWxlc01hdHJpeChcbiAgICAgIHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXgsXG4gICAgICB0aWxlc1xuICAgICk7XG4gIH1cblxuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyJykgcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXMnKSBwaXhlbEdyaWRDYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBjdHghOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHBpeGVsR3JpZCE6IFBpeGVsR3JpZDtcbiAgcGl4ZWxHcmlkVGlsZXNNYXRyaXghOiBJVGlsZVtdW107XG5cbiAgdG9vbHRpcFJlZiE6IE92ZXJsYXlSZWY7XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uUmVzaXplKCkge1xuICAgIGNvbnN0IHBpeGVsR3JpZFNpemUgPSB0aGlzLmdldFBpeGVsR3JpZFNpemUodGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeCwgdGhpcy5waXhlbEdyaWQuZ3V0dGVyKTtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gcGl4ZWxHcmlkU2l6ZS53aWR0aDtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IHBpeGVsR3JpZFNpemUuaGVpZ2h0O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY3R4ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpITtcblxuICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVNb3VzZUNsaWNrKTtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlKTtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5oYW5kbGVNb3VzZU91dCk7XG5cbiAgICB0aGlzLnBpeGVsR3JpZCA9IG5ldyBQaXhlbEdyaWQoXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuY29sdW1ucyxcbiAgICAgIHRoaXMucGl4ZWxHcmlkU2VydmljZS5yb3dzLFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmd1dHRlclxuICAgICk7XG4gICAgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeCA9IHRoaXMucGl4ZWxHcmlkLmJ1aWxkVGlsZXNNYXRyaXgoXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UudGlsZVNpemUsXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UudGlsZUNvbG9yLFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLnRpbGVIb3ZlckNvbG9yXG4gICAgKTtcblxuICAgIHRoaXMub25SZXNpemUoKTtcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLmxvb3AoKSk7XG4gIH1cbiAgXG4gIGxvb3AoKSB7XG4gICAgXG4gICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoLCB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCk7XG5cbiAgICB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4LmZvckVhY2gocm93ID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICAvLyBJZiB0aGUgdGlsZSBpcyBhIHBpeGVsLCB0aGVuIHBhaW50IGJhc2U2NCBpbWFnZSB0byB0aGUgY3R4XG4gICAgICAgIGlmICh0aWxlLmlzUGl4ZWwpIHtcbiAgICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICBpbWcuc3JjID0gdGlsZS5pbWchO1xuICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGggKyAxLCB0aWxlLnNpemUuaGVpZ2h0ICsgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRpbGUuY29sb3I7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QodGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCwgdGlsZS5zaXplLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmxvb3AoKSk7XG4gIH1cblxuICBnZXRQaXhlbEdyaWRTaXplKHBpeGVsR3JpZFRpbGVzTWF0cml4OiBJVGlsZVtdW10sIGd1dHRlcjogbnVtYmVyKTogSVNpemUge1xuICAgIGNvbnN0IHdpZHRoID0gcGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF0ubGVuZ3RoICogcGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF1bMF0uc2l6ZS53aWR0aCArIChwaXhlbEdyaWRUaWxlc01hdHJpeFswXS5sZW5ndGggLSAxKSAqIGd1dHRlcjtcbiAgICBjb25zdCBoZWlnaHQgPSBwaXhlbEdyaWRUaWxlc01hdHJpeC5sZW5ndGggKiBwaXhlbEdyaWRUaWxlc01hdHJpeFswXVswXS5zaXplLmhlaWdodCArIChwaXhlbEdyaWRUaWxlc01hdHJpeC5sZW5ndGggLSAxKSAqIGd1dHRlcjtcbiAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICB3aGF0VGlsZUlzTW91c2VPdmVyKGV2ZW50OiBNb3VzZUV2ZW50KTogSVRpbGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgbGV0IHJldHVyblRpbGUgPSB1bmRlZmluZWQ7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvcihsZXQgaiA9IDA7IGogPCB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4W2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4W2ldW2pdO1xuICAgICAgICBpZiAoeCA+PSB0aWxlLmNvb3JkaW5hdGVzLnggJiYgeCA8PSB0aWxlLmNvb3JkaW5hdGVzLnggKyB0aWxlLnNpemUud2lkdGggJiZcbiAgICAgICAgICB5ID49IHRpbGUuY29vcmRpbmF0ZXMueSAmJiB5IDw9IHRpbGUuY29vcmRpbmF0ZXMueSArIHRpbGUuc2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVyblRpbGUgPSB0aWxlO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHVyblRpbGU7XG4gIH1cblxuICBoYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMud2hhdFRpbGVJc01vdXNlT3ZlcihldmVudCk7XG4gICAgaWYgKHRpbGUpIHRoaXMudGlsZUNsaWNrLmVtaXQoeyBpZDogdGlsZS5pZCwgaHJlZjogdGlsZS5ocmVmID8/IHVuZGVmaW5lZCB9KTtcbiAgfVxuXG4gIGN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkOiBJVGlsZSB8IHVuZGVmaW5lZDtcbiAgdG9vbHRpcFBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCk7XG4gIGhhbmRsZU1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLndoYXRUaWxlSXNNb3VzZU92ZXIoZXZlbnQpO1xuICAgIGlmICh0aWxlKSB7XG4gICAgICAvLyBJZiB0aGUgdGlsZSBpcyB0aGUgc2FtZSBhcyB0aGUgb25lIGJlaW5nIGhvdmVyZWQsIGRvIG5vdGhpbmdcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgPT09IHRpbGUuaWQpIHJldHVybjtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgdGlsZSBiZWluZyBob3ZlcmVkLCByZXNldCBpdHMgY29sb3JcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgIT09IHRpbGUuaWQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuY29sb3I7XG4gICAgICB9XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHRvb2x0aXAgYmVpbmcgc2hvd24sIGRlc3Ryb3kgaXRcbiAgICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kZXRhY2goKTtcbiAgICAgIFxuICAgICAgLy8gU2V0IHRoZSBuZXcgdGlsZSBiZWluZyBob3ZlcmVkXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkID0gdGlsZTtcbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmhvdmVyQ29sb3I7XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgdG9vbHRpcCBzdHJhdGVneVxuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMudG9vbHRpcE92ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKTtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kudG9wKGAke2V2ZW50LmNsaWVudFkgKyAxNX1weGApLmxlZnQoYCR7ZXZlbnQuY2xpZW50WCArIDE1fXB4YCk7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSB0aGlzLnRvb2x0aXBPdmVybGF5LmNyZWF0ZSh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3ksXG4gICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMudG9vbHRpcE92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKClcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIHRvb2x0aXAgY29tcG9uZW50XG4gICAgICBjb25zdCB0b29sdGlwQ29tcG9uZW50ID0gdGhpcy50b29sdGlwUmVmLmF0dGFjaCh0aGlzLnRvb2x0aXBQb3J0YWwpO1xuICAgICAgdG9vbHRpcENvbXBvbmVudC5pbnN0YW5jZS50ZXh0ID0gdGlsZS50b29sdGlwVGV4dCA/PyB0aWxlLmlkLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgLy8gQ2xlYW4gdXBcbiAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCkgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS50aWxlQ29sb3I7XG4gICAgaWYgKHRoaXMudG9vbHRpcFJlZikgdGhpcy50b29sdGlwUmVmLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1waXhlbC1ncmlkLXRvb2x0aXAnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtY29udGVudFwiPnt7dGV4dH19PC9kaXY+PC9kaXY+YCxcbiAgc3R5bGVzOiBbYFxuICAgIDpob3N0LCAudG9vbHRpcCB7IHBvaW50ZXItZXZlbnRzOiBub25lOyB9XG4gICAgLnRvb2x0aXAgeyBcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG4gICAgICBjb2xvcjogI2ZmZjtcbiAgICAgIHBhZGRpbmc6IDVweCAxMHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICB9XG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRUb29sdGlwQ29tcG9uZW50IHtcbiAgQElucHV0KCkgdGV4dCE6IHN0cmluZztcbn0iXX0=