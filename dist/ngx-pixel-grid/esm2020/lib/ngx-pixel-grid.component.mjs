import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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
    } }, styles: [".tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"], encapsulation: 3 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelGridTooltipComponent, [{
        type: Component,
        args: [{ selector: 'ngx-pixel-grid-tooltip', template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, encapsulation: ViewEncapsulation.ShadowDom, styles: [".tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] }]
    }], null, { text: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWN2QixNQUFNLE9BQU8scUJBQXFCO0lBRWhDLFlBQ1UsTUFBYyxFQUNkLGdCQUFxQyxFQUNyQyxjQUF1QjtRQUZ2QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUNyQyxtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUd2QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFlMUQsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBbUNsRSxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3hFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0RixJQUFJLElBQUk7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsQ0FB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QVM7Z0JBRVMsSUFBSTtrQkFBWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQaXhlbEdyaWQgfSBmcm9tICcuL2NsYXNzZXMvcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBJVGlsZSwgSVRpbGVDbGlja0V2ZW50IH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcbmltcG9ydCB7IE5neFBpeGVsR3JpZFNlcnZpY2UgfSBmcm9tICcuL25neC1waXhlbC1ncmlkLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZCcsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIgY2xhc3M9XCJwaXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXJcIj5cbiAgICA8Y2FudmFzICNwaXhlbEdyaWRDYW52YXM+PC9jYW52YXM+XG4gIDwvZGl2PmAsXG4gIHN0eWxlczogWycucGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgfSddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGl4ZWxHcmlkU2VydmljZTogTmd4UGl4ZWxHcmlkU2VydmljZSxcbiAgICBwcml2YXRlIHRvb2x0aXBPdmVybGF5OiBPdmVybGF5XG4gICkgeyB9XG4gIFxuICBAT3V0cHV0KCkgdGlsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxJVGlsZUNsaWNrRXZlbnQ+KCk7XG5cbiAgQElucHV0KCkgc2V0IHBpeGVscyh0aWxlczogSVRpbGVbXSkge1xuICAgIGlmICghdGlsZXMgfHwgIXRpbGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIHRoaXMudGlsZXNNYXRyaXggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UubWVyZ2VUaWxlc01hdHJpeCh0aGlzLnRpbGVzTWF0cml4LCB0aWxlcyk7XG4gIH1cblxuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyJykgcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXMnKSBwaXhlbEdyaWRDYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBjdHghOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHBpeGVsR3JpZCE6IFBpeGVsR3JpZDtcbiAgdGlsZXNNYXRyaXghOiBJVGlsZVtdW107XG5cbiAgdG9vbHRpcFJlZiE6IE92ZXJsYXlSZWY7XG4gIHRvb2x0aXBQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQpO1xuXG4gIG5nT25Jbml0KCk6IHZvaWQgeyAgICBcbiAgICBjb25zdCB7IHBpeGVsR3JpZCwgdGlsZXNNYXRyaXggfSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5idWlsZFRpbGVzTWF0cml4KCk7XG4gICAgdGhpcy5waXhlbEdyaWQgPSBwaXhlbEdyaWQ7XG4gICAgdGhpcy50aWxlc01hdHJpeCA9IHRpbGVzTWF0cml4O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5jdHggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuY3JlYXRlQ3R4KHRoaXMudGlsZXNNYXRyaXgsIGNhbnZhcyk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVNb3VzZUNsaWNrKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmUpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMuaGFuZGxlTW91c2VPdXQpO1xuICAgIFxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMubG9vcCgpKTtcbiAgfVxuICBcbiAgbG9vcCgpOiB2b2lkIHtcbiAgICB0aGlzLnRpbGVzTWF0cml4LmZvckVhY2gocm93ID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgICBpZiAodGlsZS5pc1BpeGVsKSB7XG4gICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgaW1nLnNyYyA9IHRpbGUuaW1nITtcbiAgICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCB0aWxlLmNvb3JkaW5hdGVzLngsIHRpbGUuY29vcmRpbmF0ZXMueSwgdGlsZS5zaXplLndpZHRoICsgMSwgdGlsZS5zaXplLmhlaWdodCArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRpbGUuY29sb3I7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QodGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCwgdGlsZS5zaXplLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMubG9vcCgpKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLndoYXRUaWxlSXNNb3VzZU92ZXIodGhpcy50aWxlc01hdHJpeCwgcmVjdCwgZXZlbnQpO1xuICAgIGlmICh0aWxlKSB0aGlzLnRpbGVDbGljay5lbWl0KHsgaWQ6IHRpbGUuaWQsIGhyZWY6IHRpbGUuaHJlZiA/PyB1bmRlZmluZWQgfSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU91dCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCkgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5vcHRpb25zLnRpbGVDb2xvcjtcbiAgICBpZiAodGhpcy50b29sdGlwUmVmKSB0aGlzLnRvb2x0aXBSZWYuZGlzcG9zZSgpO1xuICB9XG5cbiAgY3VycmVudFRpbGVCZWluZ0hvdmVyZWQ6IElUaWxlIHwgdW5kZWZpbmVkO1xuICBoYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLndoYXRUaWxlSXNNb3VzZU92ZXIodGhpcy50aWxlc01hdHJpeCwgcmVjdCwgZXZlbnQpO1xuICAgIGlmICh0aWxlKSB7XG4gICAgICAvLyBLaW5kIG9mIHRyaWNreSBoZXJlIHdhbnQgdG8gbGVhdmUgY29tbWVudCBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgLy8gV2UgYXJlIGp1c3QgdHJ5aW5nIHN3YXAgb3V0IGNvbG9ycyBvZiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb25cbiAgICAgIC8vIFNvIGEgcmVmZXJuY2UgaXMgbWFkZSB0byB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24gYW5kIHRoZSBjb2xvciBpcyBjaGFuZ2VkXG4gICAgICAvLyBJZiB0aGUgdGlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBob3ZlcmVkIG9uIGlzIHRoZSBzYW1lIGFzIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiwgcmV0dXJuXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkID09PSB0aWxlLmlkKSByZXR1cm47XG4gICAgICAvLyBJZiB0aGUgdG9vbHRpcCBpcyBvcGVuLCBjbG9zZSBpdFxuICAgICAgLy8gIUBUT0RPIC0gU2hvdWxkIG9ubHkgZGV0YWNoIGlmIHRoZSBuZXcgdGlsZSBpcyBvbiBzYW1lIHRpbGUgZ3JvdXAgYXMgdGhlIGxhc3RcbiAgICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kZXRhY2goKTtcbiAgICAgIC8vIElmIHRoZSB0aWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGhvdmVyZWQgb24gaXMgZGlmZmVyZW50IHRoYW4gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uLCBcbiAgICAgIC8vIHdlIG5lZWQgdG8gY2hhbmdlIHRoZSBjb2xvciBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjb2xvclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgJiYgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5pZCAhPT0gdGlsZS5pZCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSBjdXJyZW50VGlsZUJlaW5nSG92ZXJlZCB0byB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb25cbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgPSB0aWxlO1xuXG4gICAgICAvLyBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiB0byB0aGUgaG92ZXIgY29sb3JcbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmhvdmVyQ29sb3I7XG5cbiAgICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLnRvb2x0aXBPdmVybGF5XG4gICAgICAucG9zaXRpb24oKS5nbG9iYWwoKVxuICAgICAgLnRvcChgJHtldmVudC5jbGllbnRZICsgMTV9cHhgKVxuICAgICAgLmxlZnQoYCR7ZXZlbnQuY2xpZW50WCArIDE1fXB4YCk7XG5cbiAgICAgIHRoaXMudG9vbHRpcFJlZiA9IHRoaXMudG9vbHRpcE92ZXJsYXkuY3JlYXRlKHtcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneSxcbiAgICAgICAgaGFzQmFja2Ryb3A6IGZhbHNlLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy50b29sdGlwT3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmNsb3NlKClcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0b29sdGlwQ29tcG9uZW50ID0gdGhpcy50b29sdGlwUmVmLmF0dGFjaCh0aGlzLnRvb2x0aXBQb3J0YWwpO1xuICAgICAgdG9vbHRpcENvbXBvbmVudC5pbnN0YW5jZS50ZXh0ID0gdGlsZS50b29sdGlwVGV4dCA/PyB0aWxlLmlkLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1waXhlbC1ncmlkLXRvb2x0aXAnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtY29udGVudFwiPnt7dGV4dH19PC9kaXY+PC9kaXY+YCxcbiAgc3R5bGVzOiBbYC50b29sdGlwIHsgIGJhY2tncm91bmQtY29sb3I6ICMwMDA7IGNvbG9yOiAjZmZmOyBwYWRkaW5nOiA1cHggMTBweDsgYm9yZGVyLXJhZGl1czogNXB4OyB9YF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRUb29sdGlwQ29tcG9uZW50IHsgQElucHV0KCkgdGV4dCE6IHN0cmluZzsgfVxuIl19