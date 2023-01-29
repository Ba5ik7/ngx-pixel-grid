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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFFWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWN2QixNQUFNLE9BQU8scUJBQXFCO0lBRWhDLFlBQ1UsTUFBYyxFQUNkLGdCQUFxQyxFQUNyQyxjQUF1QjtRQUZ2QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUNyQyxtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUd2QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFlMUQsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBbUNsRSxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3hFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0RixJQUFJLElBQUk7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsQ0FB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QVM7Z0JBRVMsSUFBSTtrQkFBWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBpeGVsR3JpZCB9IGZyb20gJy4vY2xhc3Nlcy9waXhlbC1ncmlkJztcbmltcG9ydCB7IElUaWxlLCBJVGlsZUNsaWNrRXZlbnQgfSBmcm9tICcuL2ludGVyZmFjZXMvbmd4LXBpeGVsLWdyaWQnO1xuaW1wb3J0IHsgTmd4UGl4ZWxHcmlkU2VydmljZSB9IGZyb20gJy4vbmd4LXBpeGVsLWdyaWQuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1waXhlbC1ncmlkJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiAjcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciBjbGFzcz1cInBpeGVsLWdyaWQtY2FudmFzLWNvbnRhaW5lclwiPlxuICAgIDxjYW52YXMgI3BpeGVsR3JpZENhbnZhcz48L2NhbnZhcz5cbiAgPC9kaXY+YCxcbiAgc3R5bGVzOiBbJy5waXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXIgeyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB9J10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE5neFBpeGVsR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBwaXhlbEdyaWRTZXJ2aWNlOiBOZ3hQaXhlbEdyaWRTZXJ2aWNlLFxuICAgIHByaXZhdGUgdG9vbHRpcE92ZXJsYXk6IE92ZXJsYXlcbiAgKSB7IH1cbiAgXG4gIEBPdXRwdXQoKSB0aWxlQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPElUaWxlQ2xpY2tFdmVudD4oKTtcblxuICBASW5wdXQoKSBzZXQgcGl4ZWxzKHRpbGVzOiBJVGlsZVtdKSB7XG4gICAgaWYgKCF0aWxlcyB8fCAhdGlsZXMubGVuZ3RoKSByZXR1cm47XG4gICAgdGhpcy50aWxlc01hdHJpeCA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5tZXJnZVRpbGVzTWF0cml4KHRoaXMudGlsZXNNYXRyaXgsIHRpbGVzKTtcbiAgfVxuXG4gIEBWaWV3Q2hpbGQoJ3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXInKSBwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3BpeGVsR3JpZENhbnZhcycpIHBpeGVsR3JpZENhbnZhcyE6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xuXG4gIGN0eCE6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcGl4ZWxHcmlkITogUGl4ZWxHcmlkO1xuICB0aWxlc01hdHJpeCE6IElUaWxlW11bXTtcblxuICB0b29sdGlwUmVmITogT3ZlcmxheVJlZjtcbiAgdG9vbHRpcFBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCk7XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7ICAgIFxuICAgIGNvbnN0IHsgcGl4ZWxHcmlkLCB0aWxlc01hdHJpeCB9ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmJ1aWxkVGlsZXNNYXRyaXgoKTtcbiAgICB0aGlzLnBpeGVsR3JpZCA9IHBpeGVsR3JpZDtcbiAgICB0aGlzLnRpbGVzTWF0cml4ID0gdGlsZXNNYXRyaXg7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmN0eCA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5jcmVhdGVDdHgodGhpcy50aWxlc01hdHJpeCwgY2FudmFzKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZU1vdXNlQ2xpY2spO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZSk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5oYW5kbGVNb3VzZU91dCk7XG4gICAgXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5sb29wKCkpO1xuICB9XG4gIFxuICBsb29wKCk6IHZvaWQge1xuICAgIHRoaXMudGlsZXNNYXRyaXguZm9yRWFjaChyb3cgPT4ge1xuICAgICAgcm93LmZvckVhY2godGlsZSA9PiB7XG4gICAgICAgIGlmICh0aWxlLmlzUGl4ZWwpIHtcbiAgICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICBpbWcuc3JjID0gdGlsZS5pbWchO1xuICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGggKyAxLCB0aWxlLnNpemUuaGVpZ2h0ICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGlsZS5jb2xvcjtcbiAgICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh0aWxlLmNvb3JkaW5hdGVzLngsIHRpbGUuY29vcmRpbmF0ZXMueSwgdGlsZS5zaXplLndpZHRoLCB0aWxlLnNpemUuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5sb29wKCkpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uud2hhdFRpbGVJc01vdXNlT3Zlcih0aGlzLnRpbGVzTWF0cml4LCByZWN0LCBldmVudCk7XG4gICAgaWYgKHRpbGUpIHRoaXMudGlsZUNsaWNrLmVtaXQoeyBpZDogdGlsZS5pZCwgaHJlZjogdGlsZS5ocmVmID8/IHVuZGVmaW5lZCB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkKSB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLm9wdGlvbnMudGlsZUNvbG9yO1xuICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kaXNwb3NlKCk7XG4gIH1cblxuICBjdXJyZW50VGlsZUJlaW5nSG92ZXJlZDogSVRpbGUgfCB1bmRlZmluZWQ7XG4gIGhhbmRsZU1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uud2hhdFRpbGVJc01vdXNlT3Zlcih0aGlzLnRpbGVzTWF0cml4LCByZWN0LCBldmVudCk7XG4gICAgaWYgKHRpbGUpIHtcbiAgICAgIC8vIEtpbmQgb2YgdHJpY2t5IGhlcmUgd2FudCB0byBsZWF2ZSBjb21tZW50IGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAvLyBXZSBhcmUganVzdCB0cnlpbmcgc3dhcCBvdXQgY29sb3JzIG9mIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvblxuICAgICAgLy8gU28gYSByZWZlcm5jZSBpcyBtYWRlIHRvIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiBhbmQgdGhlIGNvbG9yIGlzIGNoYW5nZWRcbiAgICAgIC8vIElmIHRoZSB0aWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGhvdmVyZWQgb24gaXMgdGhlIHNhbWUgYXMgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uLCByZXR1cm5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgPT09IHRpbGUuaWQpIHJldHVybjtcbiAgICAgIC8vIElmIHRoZSB0b29sdGlwIGlzIG9wZW4sIGNsb3NlIGl0XG4gICAgICAvLyAhQFRPRE8gLSBTaG91bGQgb25seSBkZXRhY2ggaWYgdGhlIG5ldyB0aWxlIGlzIG9uIHNhbWUgdGlsZSBncm91cCBhcyB0aGUgbGFzdFxuICAgICAgaWYgKHRoaXMudG9vbHRpcFJlZikgdGhpcy50b29sdGlwUmVmLmRldGFjaCgpO1xuICAgICAgLy8gSWYgdGhlIHRpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgaG92ZXJlZCBvbiBpcyBkaWZmZXJlbnQgdGhhbiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24sIFxuICAgICAgLy8gd2UgbmVlZCB0byBjaGFuZ2UgdGhlIGNvbG9yIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGNvbG9yXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkICE9PSB0aWxlLmlkKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgdGhlIGN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkIHRvIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvblxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCA9IHRpbGU7XG5cbiAgICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uIHRvIHRoZSBob3ZlciBjb2xvclxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRpbGUuaG92ZXJDb2xvcjtcblxuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMudG9vbHRpcE92ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpLmdsb2JhbCgpXG4gICAgICAudG9wKGAke2V2ZW50LmNsaWVudFkgKyAxNX1weGApXG4gICAgICAubGVmdChgJHtldmVudC5jbGllbnRYICsgMTV9cHhgKTtcblxuICAgICAgdGhpcy50b29sdGlwUmVmID0gdGhpcy50b29sdGlwT3ZlcmxheS5jcmVhdGUoe1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5LFxuICAgICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLnRvb2x0aXBPdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuY2xvc2UoKVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRvb2x0aXBDb21wb25lbnQgPSB0aGlzLnRvb2x0aXBSZWYuYXR0YWNoKHRoaXMudG9vbHRpcFBvcnRhbCk7XG4gICAgICB0b29sdGlwQ29tcG9uZW50Lmluc3RhbmNlLnRleHQgPSB0aWxlLnRvb2x0aXBUZXh0ID8/IHRpbGUuaWQudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXBpeGVsLWdyaWQtdG9vbHRpcCcsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1jb250ZW50XCI+e3t0ZXh0fX08L2Rpdj48L2Rpdj5gLFxuICBzdHlsZXM6IFtgLnRvb2x0aXAgeyAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsgY29sb3I6ICNmZmY7IHBhZGRpbmc6IDVweCAxMHB4OyBib3JkZXItcmFkaXVzOiA1cHg7IH1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQgeyBASW5wdXQoKSB0ZXh0ITogc3RyaW5nOyB9XG4iXX0=