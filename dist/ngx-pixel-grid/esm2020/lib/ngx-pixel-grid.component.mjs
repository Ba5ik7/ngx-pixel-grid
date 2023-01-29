import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
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
        this.tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
        this.handleMouseClick = (event) => {
            const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
            const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
            if (tile)
                this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
        };
        this.handleMouseOut = () => {
            if (this.currentTileBeingHovered)
                this.currentTileBeingHovered.color = this.pixelGridService.options.tileColor;
            if (this.tooltipRef)
                this.tooltipRef.dispose();
        };
        this.handleMouseMove = (event) => {
            const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
            const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
            if (tile) {
                // Kind of tricky here want to leave comment for future reference
                // We are just trying swap out colors of the tile we are hovering on
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
                // Set the currentTileBeingHovered to the tile we are hovering on
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
    }
    onResize() {
        const pixelGridSize = this.pixelGridService.getPixelGridSize(this.tilesMatrix, this.pixelGrid.gutter);
        this.pixelGridCanvas.nativeElement.width = pixelGridSize.width;
        this.pixelGridCanvas.nativeElement.height = pixelGridSize.height;
    }
    ngOnInit() {
        const { pixelGrid, tilesMatrix } = this.pixelGridService.buildTilesMatrix();
        this.pixelGrid = pixelGrid;
        this.tilesMatrix = tilesMatrix;
    }
    ngAfterViewInit() {
        this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d');
        const nativeElement = this.pixelGridCanvas.nativeElement;
        nativeElement.style.cursor = 'pointer';
        nativeElement.addEventListener('click', this.handleMouseClick);
        nativeElement.addEventListener('mousemove', this.handleMouseMove);
        nativeElement.addEventListener('mouseout', this.handleMouseOut);
        this.onResize();
        this.ngZone.runOutsideAngular(() => this.loop());
    }
    loop() {
        this.tilesMatrix.forEach(row => {
            row.forEach(tile => {
                if (tile.isPixel) {
                    const img = new Image();
                    img.src = tile.img;
                    this.ctx.drawImage(img, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
                }
                else {
                    this.ctx.fillStyle = tile.color;
                    this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
                }
            });
        });
        requestAnimationFrame(() => this.loop());
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
    } }, styles: [".tooltip[_ngcontent-%COMP%]{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelGridTooltipComponent, [{
        type: Component,
        args: [{ selector: 'ngx-pixel-grid-tooltip', template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, styles: [".tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] }]
    }], null, { text: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWN2QixNQUFNLE9BQU8scUJBQXFCO0lBRWhDLFlBQ1UsTUFBYyxFQUNkLGdCQUFxQyxFQUNyQyxjQUF1QjtRQUZ2QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUNyQyxtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUd2QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFrQjFELGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQTRDbEUscUJBQWdCLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEYsSUFBSSxJQUFJO2dCQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLENBQUMs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R0gsbUJBRVUsdUJBQXVCLENBQUMsTUFBTTtpSEFVckMsU0FBUztrQkFBbEIsTUFBTTtZQUVNLE1BQU07a0JBQWxCLEtBQUs7WUFRa0MseUJBQXlCO2tCQUFoRSxTQUFTO21CQUFDLDJCQUEyQjtZQUNSLGVBQWU7a0JBQTVDLFNBQVM7bUJBQUMsaUJBQWlCO1lBVTVCLFFBQVE7a0JBRFAsWUFBWTttQkFBQyxlQUFlOztBQW9HL0IsTUFBTSxPQUFPLDRCQUE0Qjs7d0dBQTVCLDRCQUE0QjsrRUFBNUIsNEJBQTRCO1FBSDVCLDhCQUFxQixhQUFBO1FBQTZCLFlBQVE7UUFBQSxpQkFBTSxFQUFBOztRQUFkLGVBQVE7UUFBUiw4QkFBUTs7dUZBRzFELDRCQUE0QjtjQUx4QyxTQUFTOzJCQUNFLHdCQUF3QixZQUN4Qix3RUFBd0U7Z0JBRy9CLElBQUk7a0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBpeGVsR3JpZCB9IGZyb20gJy4vY2xhc3Nlcy9waXhlbC1ncmlkJztcbmltcG9ydCB7IElTaXplLCBJVGlsZSwgSVRpbGVDbGlja0V2ZW50IH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcbmltcG9ydCB7IE5neFBpeGVsR3JpZFNlcnZpY2UgfSBmcm9tICcuL25neC1waXhlbC1ncmlkLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZCcsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIgY2xhc3M9XCJwaXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXJcIj5cbiAgICA8Y2FudmFzICNwaXhlbEdyaWRDYW52YXM+PC9jYW52YXM+XG4gIDwvZGl2PmAsXG4gIHN0eWxlczogWycucGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgfSddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGl4ZWxHcmlkU2VydmljZTogTmd4UGl4ZWxHcmlkU2VydmljZSxcbiAgICBwcml2YXRlIHRvb2x0aXBPdmVybGF5OiBPdmVybGF5XG4gICkgeyB9XG4gIFxuICBAT3V0cHV0KCkgdGlsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxJVGlsZUNsaWNrRXZlbnQ+KCk7XG5cbiAgQElucHV0KCkgc2V0IHBpeGVscyh0aWxlczogSVRpbGVbXSkge1xuICAgIGlmICghdGlsZXMgfHwgIXRpbGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIHRoaXMudGlsZXNNYXRyaXggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UubWVyZ2VUaWxlc01hdHJpeChcbiAgICAgIHRoaXMudGlsZXNNYXRyaXgsXG4gICAgICB0aWxlc1xuICAgICk7XG4gIH1cblxuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyJykgcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXMnKSBwaXhlbEdyaWRDYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBjdHghOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHBpeGVsR3JpZCE6IFBpeGVsR3JpZDtcbiAgdGlsZXNNYXRyaXghOiBJVGlsZVtdW107XG5cbiAgdG9vbHRpcFJlZiE6IE92ZXJsYXlSZWY7XG4gIHRvb2x0aXBQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQpO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBvblJlc2l6ZSgpIHtcbiAgICBjb25zdCBwaXhlbEdyaWRTaXplID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmdldFBpeGVsR3JpZFNpemUodGhpcy50aWxlc01hdHJpeCwgdGhpcy5waXhlbEdyaWQuZ3V0dGVyKTtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gcGl4ZWxHcmlkU2l6ZS53aWR0aDtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IHBpeGVsR3JpZFNpemUuaGVpZ2h0O1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7ICAgIFxuICAgIGNvbnN0IHsgcGl4ZWxHcmlkLCB0aWxlc01hdHJpeCB9ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmJ1aWxkVGlsZXNNYXRyaXgoKTtcbiAgICB0aGlzLnBpeGVsR3JpZCA9IHBpeGVsR3JpZDtcbiAgICB0aGlzLnRpbGVzTWF0cml4ID0gdGlsZXNNYXRyaXg7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jdHggPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJykhO1xuICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50O1xuICAgIG5hdGl2ZUVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgIG5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZU1vdXNlQ2xpY2spO1xuICAgIG5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmUpO1xuICAgIG5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmhhbmRsZU1vdXNlT3V0KTtcblxuICAgIHRoaXMub25SZXNpemUoKTtcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLmxvb3AoKSk7XG4gIH1cbiAgXG4gIGxvb3AoKSB7XG4gICAgdGhpcy50aWxlc01hdHJpeC5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICByb3cuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgICAgaWYgKHRpbGUuaXNQaXhlbCkge1xuICAgICAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgIGltZy5zcmMgPSB0aWxlLmltZyE7XG4gICAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgdGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCArIDEsIHRpbGUuc2l6ZS5oZWlnaHQgKyAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aWxlLmNvbG9yO1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGgsIHRpbGUuc2l6ZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmxvb3AoKSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS53aGF0VGlsZUlzTW91c2VPdmVyKHRoaXMudGlsZXNNYXRyaXgsIHJlY3QsIGV2ZW50KTtcbiAgICBpZiAodGlsZSkgdGhpcy50aWxlQ2xpY2suZW1pdCh7IGlkOiB0aWxlLmlkLCBocmVmOiB0aWxlLmhyZWYgPz8gdW5kZWZpbmVkIH0pO1xuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQpIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uub3B0aW9ucy50aWxlQ29sb3I7XG4gICAgaWYgKHRoaXMudG9vbHRpcFJlZikgdGhpcy50b29sdGlwUmVmLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkOiBJVGlsZSB8IHVuZGVmaW5lZDtcbiAgaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS53aGF0VGlsZUlzTW91c2VPdmVyKHRoaXMudGlsZXNNYXRyaXgsIHJlY3QsIGV2ZW50KTtcbiAgICBpZiAodGlsZSkge1xuICAgICAgLy8gS2luZCBvZiB0cmlja3kgaGVyZSB3YW50IHRvIGxlYXZlIGNvbW1lbnQgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgIC8vIFdlIGFyZSBqdXN0IHRyeWluZyBzd2FwIG91dCBjb2xvcnMgb2YgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uXG4gICAgICAvLyBTbyBhIHJlZmVybmNlIGlzIG1hZGUgdG8gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uIGFuZCB0aGUgY29sb3IgaXMgY2hhbmdlZFxuICAgICAgLy8gSWYgdGhlIHRpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgaG92ZXJlZCBvbiBpcyB0aGUgc2FtZSBhcyB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24sIHJldHVyblxuICAgICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgJiYgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5pZCA9PT0gdGlsZS5pZCkgcmV0dXJuO1xuICAgICAgLy8gSWYgdGhlIHRvb2x0aXAgaXMgb3BlbiwgY2xvc2UgaXRcbiAgICAgIC8vICFAVE9ETyAtIFNob3VsZCBvbmx5IGRldGFjaCBpZiB0aGUgbmV3IHRpbGUgaXMgb24gc2FtZSB0aWxlIGdyb3VwIGFzIHRoZSBsYXN0XG4gICAgICBpZiAodGhpcy50b29sdGlwUmVmKSB0aGlzLnRvb2x0aXBSZWYuZGV0YWNoKCk7XG4gICAgICAvLyBJZiB0aGUgdGlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBob3ZlcmVkIG9uIGlzIGRpZmZlcmVudCB0aGFuIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiwgXG4gICAgICAvLyB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgY29sb3IgYmFjayB0byB0aGUgb3JpZ2luYWwgY29sb3JcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgIT09IHRpbGUuaWQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuY29sb3I7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldCB0aGUgY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgdG8gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkID0gdGlsZTtcblxuICAgICAgLy8gQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24gdG8gdGhlIGhvdmVyIGNvbG9yXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5ob3ZlckNvbG9yO1xuXG4gICAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy50b29sdGlwT3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKCkuZ2xvYmFsKClcbiAgICAgIC50b3AoYCR7ZXZlbnQuY2xpZW50WSArIDE1fXB4YClcbiAgICAgIC5sZWZ0KGAke2V2ZW50LmNsaWVudFggKyAxNX1weGApO1xuXG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSB0aGlzLnRvb2x0aXBPdmVybGF5LmNyZWF0ZSh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3ksXG4gICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMudG9vbHRpcE92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5jbG9zZSgpXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdG9vbHRpcENvbXBvbmVudCA9IHRoaXMudG9vbHRpcFJlZi5hdHRhY2godGhpcy50b29sdGlwUG9ydGFsKTtcbiAgICAgIHRvb2x0aXBDb21wb25lbnQuaW5zdGFuY2UudGV4dCA9IHRpbGUudG9vbHRpcFRleHQgPz8gdGlsZS5pZC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZC10b29sdGlwJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRlbnRcIj57e3RleHR9fTwvZGl2PjwvZGl2PmAsXG4gIHN0eWxlczogW2AudG9vbHRpcCB7ICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwOyBjb2xvcjogI2ZmZjsgcGFkZGluZzogNXB4IDEwcHg7IGJvcmRlci1yYWRpdXM6IDVweDsgfWBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRUb29sdGlwQ29tcG9uZW50IHsgQElucHV0KCkgdGV4dCE6IHN0cmluZzsgfVxuIl19