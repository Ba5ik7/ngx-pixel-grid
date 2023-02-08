import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-pixel-grid.service";
import * as i2 from "@angular/cdk/overlay";
const _c0 = ["pixelGridCanvas"];
export class NgxPixelGridComponent {
    constructor(ngZone, pixelGridService, tooltipOverlay) {
        this.ngZone = ngZone;
        this.pixelGridService = pixelGridService;
        this.tooltipOverlay = tooltipOverlay;
        this.tileClick = new EventEmitter();
        this.hasLoadedPixels = false;
        this.tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
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
    // timeDelta = 0.005 * .05;
    // time = 0;
    // switchLayout = true;
    loop(timestamp) {
        this.ctx.clearRect(0, 0, this.pixelGridCanvas.nativeElement.width, this.pixelGridCanvas.nativeElement.height);
        // this.time += this.timeDelta;
        // this.time += (Math.sin(this.time) < 0 ? .3 : Math.cos(this.time) > 0.5 ? 0.3 : 0.8) * this.timeDelta;
        // if (this.time > 1) {
        //   this.time = 0;
        //   // this.switchLayout = !this.switchLayout;
        // }
        // this.pixelGrid.tiles.forEach(tile => {
        //   tile.sourceCoordinates.x = tile.coordinates.x;
        //   tile.sourceCoordinates.y = tile.coordinates.y;
        // });
        // let tiles = this.pixelGridService.gridLayout(this.pixelGrid.tiles);
        // let tiles = this.pixelGrid.tiles;
        // if(this.hasLoadedPixels) {
        //   tiles = this.pixelGridService.gridLayout(this.pixelGrid.tiles);
        // } else {
        //   tiles = this.pixelGridService.phyllotaxisLayout(
        //     this.pixelGrid.tiles,
        //     this.pixelGridCanvas.nativeElement.width * .5,
        //     this.pixelGridCanvas.nativeElement.height * .5
        //   );
        // }
        this.pixelGrid.tiles.forEach(tile => {
            // tiles.forEach(tile => {
            // tile.targetCoordinates.x = tile.coordinates.x;
            // tile.targetCoordinates.y = tile.coordinates.y;
            // tile.coordinates.x = tile.sourceCoordinates.x * (1 - this.time) + tile.targetCoordinates.x * this.time;
            // tile.coordinates.y = tile.sourceCoordinates.y * (1 - this.time) + tile.targetCoordinates.y * this.time;
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
NgxPixelGridComponent.ɵfac = function NgxPixelGridComponent_Factory(t) { return new (t || NgxPixelGridComponent)(i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i1.NgxPixelGridService), i0.ɵɵdirectiveInject(i2.Overlay)); };
NgxPixelGridComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NgxPixelGridComponent, selectors: [["ngx-pixel-grid"]], viewQuery: function NgxPixelGridComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 5);
    } if (rf & 2) {
        let _t;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7Ozs7O0FBY3ZCLE1BQU0sT0FBTyxxQkFBcUI7SUFFaEMsWUFDVSxNQUFjLEVBQ2QsZ0JBQXFDLEVBQ3JDLGNBQXVCO1FBRnZCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXFCO1FBQ3JDLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBR3ZCLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUUxRCxvQkFBZSxHQUFHLEtBQUssQ0FBQztRQWlCeEIsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBbUVsRSxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3hFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0RixJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElB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LENBQUMsQ0FBQyxDQUFDO1FBQ0gscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDOzswRkE1RlUscUJBQXFCO3dFQUFyQixxQkFBcUI7Ozs7OztRQU5oQyxpQ0FBb0U7UUFDbEUsa0NBQWtDO1FBQ3BDLGlCQUFNOzt1RkFJSyxxQkFBcUI7Y0FUakMsU0FBUzsyQkFDRSxnQkFBZ0IsWUFDaEI7OztTQUdILG1CQUVVLHVCQUF1QixDQUFDLE1BQU07aUhBVXJDLFNBQVM7a0JBQWxCLE1BQU07WUFHTSxNQUFNO2tCQUFsQixLQUFLO1lBU3dCLGVBQWU7a0JBQTVDLFNBQVM7bUJBQUMsaUJBQWlCOztBQXdJOUIsTUFBTSxPQUFPLDRCQUE0Qjs7d0dBQTVCLDRCQUE0QjsrRUFBNUIsNEJBQTRCO1FBSjVCLDhCQUFxQixhQUFBO1FBQTZCLFlBQVE7UUFBQSxpQkFBTSxFQUFBOztRQUFkLGVBQVE7UUFBUiw4QkFBUTs7dUZBSTFELDRCQUE0QjtjQU54QyxTQUFTOzJCQUNFLHdCQUF3QixZQUN4Qix3RUFBd0UsaUJBRW5FLGlCQUFpQixDQUFDLFNBQVM7Z0JBRVMsSUFBSTtrQkFBWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQaXhlbEdyaWQgfSBmcm9tICcuL2NsYXNzZXMvcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBJVGlsZSwgSVRpbGVDbGlja0V2ZW50IH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcbmltcG9ydCB7IE5neFBpeGVsR3JpZFNlcnZpY2UgfSBmcm9tICcuL25neC1waXhlbC1ncmlkLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZCcsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIgY2xhc3M9XCJwaXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXJcIj5cbiAgICA8Y2FudmFzICNwaXhlbEdyaWRDYW52YXM+PC9jYW52YXM+XG4gIDwvZGl2PmAsXG4gIHN0eWxlczogWycucGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgfSddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGl4ZWxHcmlkU2VydmljZTogTmd4UGl4ZWxHcmlkU2VydmljZSxcbiAgICBwcml2YXRlIHRvb2x0aXBPdmVybGF5OiBPdmVybGF5XG4gICkgeyB9XG4gIFxuICBAT3V0cHV0KCkgdGlsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxJVGlsZUNsaWNrRXZlbnQ+KCk7XG5cbiAgaGFzTG9hZGVkUGl4ZWxzID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNldCBwaXhlbHModGlsZXM6IElUaWxlW10pIHtcbiAgICBpZiAoIXRpbGVzIHx8ICF0aWxlcy5sZW5ndGgpIHJldHVybjtcbiAgICB0aGlzLmhhc0xvYWRlZFBpeGVscyA9IHRydWU7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMudGlsZXNNYXRyaXggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UubWVyZ2VUaWxlc01hdHJpeCh0aGlzLnRpbGVzTWF0cml4LCB0aWxlcyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyJykgcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXMnKSBwaXhlbEdyaWRDYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBjdHghOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHBpeGVsR3JpZCE6IFBpeGVsR3JpZDtcbiAgdGlsZXNNYXRyaXghOiBJVGlsZVtdW107XG5cbiAgdG9vbHRpcFJlZiE6IE92ZXJsYXlSZWY7XG4gIHRvb2x0aXBQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQpO1xuXG4gIG5nT25Jbml0KCk6IHZvaWQgeyAgICBcbiAgICBjb25zdCB7IHBpeGVsR3JpZCwgdGlsZXNNYXRyaXggfSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5idWlsZFRpbGVzTWF0cml4KCk7XG4gICAgdGhpcy5waXhlbEdyaWQgPSBwaXhlbEdyaWQ7XG4gICAgdGhpcy50aWxlc01hdHJpeCA9IHRpbGVzTWF0cml4O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5jdHggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuY3JlYXRlQ3R4KHRoaXMudGlsZXNNYXRyaXgsIGNhbnZhcyk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVNb3VzZUNsaWNrKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmUpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMuaGFuZGxlTW91c2VPdXQpO1xuICAgIFxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSkpO1xuICB9XG4gIFxuXG4gIC8vIHRpbWVEZWx0YSA9IDAuMDA1ICogLjA1O1xuICAvLyB0aW1lID0gMDtcbiAgLy8gc3dpdGNoTGF5b3V0ID0gdHJ1ZTtcbiAgbG9vcCh0aW1lc3RhbXA6IG51bWJlcik6IHZvaWQge1xuICAgIFxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoLCB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCk7XG4gICAgLy8gdGhpcy50aW1lICs9IHRoaXMudGltZURlbHRhO1xuICAgIC8vIHRoaXMudGltZSArPSAoTWF0aC5zaW4odGhpcy50aW1lKSA8IDAgPyAuMyA6IE1hdGguY29zKHRoaXMudGltZSkgPiAwLjUgPyAwLjMgOiAwLjgpICogdGhpcy50aW1lRGVsdGE7XG4gICAgXG4gICAgLy8gaWYgKHRoaXMudGltZSA+IDEpIHtcbiAgICAvLyAgIHRoaXMudGltZSA9IDA7XG4gICAgLy8gICAvLyB0aGlzLnN3aXRjaExheW91dCA9ICF0aGlzLnN3aXRjaExheW91dDtcbiAgICAvLyB9XG4gICAgICBcbiAgICAvLyB0aGlzLnBpeGVsR3JpZC50aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgIC8vICAgdGlsZS5zb3VyY2VDb29yZGluYXRlcy54ID0gdGlsZS5jb29yZGluYXRlcy54O1xuICAgIC8vICAgdGlsZS5zb3VyY2VDb29yZGluYXRlcy55ID0gdGlsZS5jb29yZGluYXRlcy55O1xuICAgIC8vIH0pO1xuXG5cbiAgICAvLyBsZXQgdGlsZXMgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuZ3JpZExheW91dCh0aGlzLnBpeGVsR3JpZC50aWxlcyk7XG4gICAgLy8gbGV0IHRpbGVzID0gdGhpcy5waXhlbEdyaWQudGlsZXM7XG4gICAgLy8gaWYodGhpcy5oYXNMb2FkZWRQaXhlbHMpIHtcbiAgICAvLyAgIHRpbGVzID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmdyaWRMYXlvdXQodGhpcy5waXhlbEdyaWQudGlsZXMpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5waHlsbG90YXhpc0xheW91dChcbiAgICAvLyAgICAgdGhpcy5waXhlbEdyaWQudGlsZXMsXG4gICAgLy8gICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggKiAuNSxcbiAgICAvLyAgICAgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgKiAuNVxuICAgIC8vICAgKTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnBpeGVsR3JpZC50aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgIC8vIHRpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICAvLyB0aWxlLnRhcmdldENvb3JkaW5hdGVzLnggPSB0aWxlLmNvb3JkaW5hdGVzLng7XG4gICAgICAvLyB0aWxlLnRhcmdldENvb3JkaW5hdGVzLnkgPSB0aWxlLmNvb3JkaW5hdGVzLnk7XG4gICAgICAvLyB0aWxlLmNvb3JkaW5hdGVzLnggPSB0aWxlLnNvdXJjZUNvb3JkaW5hdGVzLnggKiAoMSAtIHRoaXMudGltZSkgKyB0aWxlLnRhcmdldENvb3JkaW5hdGVzLnggKiB0aGlzLnRpbWU7XG4gICAgICAvLyB0aWxlLmNvb3JkaW5hdGVzLnkgPSB0aWxlLnNvdXJjZUNvb3JkaW5hdGVzLnkgKiAoMSAtIHRoaXMudGltZSkgKyB0aWxlLnRhcmdldENvb3JkaW5hdGVzLnkgKiB0aGlzLnRpbWU7XG4gICAgICBpZiAodGlsZS5pc1BpeGVsKSB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZSh0aWxlLmltZyEsIHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGggKyAxLCB0aWxlLnNpemUuaGVpZ2h0ICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aWxlLmNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh0aWxlLmNvb3JkaW5hdGVzLngsIHRpbGUuY29vcmRpbmF0ZXMueSwgdGlsZS5zaXplLndpZHRoLCB0aWxlLnNpemUuaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9KTsgICBcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uud2hhdFRpbGVJc01vdXNlT3Zlcih0aGlzLnRpbGVzTWF0cml4LCByZWN0LCBldmVudCk7XG4gICAgdGlsZSAmJiB0aGlzLnRpbGVDbGljay5lbWl0KHsgaWQ6IHRpbGUuaWQsIGhyZWY6IHRpbGUuaHJlZiA/PyB1bmRlZmluZWQgfSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU91dCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCkge1xuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5jb2xvciA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5vcHRpb25zLnRpbGVDb2xvcjtcbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMudG9vbHRpcFJlZi5kaXNwb3NlPy4oKTtcbiAgfVxuXG4gIGN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkOiBJVGlsZSB8IHVuZGVmaW5lZDtcbiAgaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS53aGF0VGlsZUlzTW91c2VPdmVyKHRoaXMudGlsZXNNYXRyaXgsIHJlY3QsIGV2ZW50KTtcbiAgICBpZiAodGlsZSkge1xuICAgICAgLy8gS2luZCBvZiB0cmlja3kgaGVyZSwgd2FudCB0byBsZWF2ZSBjb21tZW50IGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAvLyBXZSBhcmUganVzdCB0cnlpbmcgdG8gc3dhcCBvdXQgY29sb3JzIG9mIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvblxuICAgICAgLy8gU28gYSByZWZlcm5jZSBpcyBtYWRlIHRvIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiBhbmQgdGhlIGNvbG9yIGlzIGNoYW5nZWRcbiAgICAgIC8vIElmIHRoZSB0aWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGhvdmVyZWQgb24gaXMgdGhlIHNhbWUgYXMgdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uLCByZXR1cm5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkICYmIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuaWQgPT09IHRpbGUuaWQpIHJldHVybjtcbiAgICAgIC8vIElmIHRoZSB0b29sdGlwIGlzIG9wZW4sIGNsb3NlIGl0XG4gICAgICAvLyAhQFRPRE8gLSBTaG91bGQgb25seSBkZXRhY2ggaWYgdGhlIG5ldyB0aWxlIGlzIG9uIHNhbWUgdGlsZSBncm91cCBhcyB0aGUgbGFzdFxuICAgICAgaWYgKHRoaXMudG9vbHRpcFJlZikgdGhpcy50b29sdGlwUmVmLmRldGFjaCgpO1xuICAgICAgLy8gSWYgdGhlIHRpbGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgaG92ZXJlZCBvbiBpcyBkaWZmZXJlbnQgdGhhbiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24sIFxuICAgICAgLy8gd2UgbmVlZCB0byBjaGFuZ2UgdGhlIGNvbG9yIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGNvbG9yXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkICE9PSB0aWxlLmlkKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgdGhlIHJlZmVyZW5jZSB0byB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb25cbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgPSB0aWxlO1xuXG4gICAgICAvLyBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiB0byB0aGUgaG92ZXIgY29sb3JcbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmhvdmVyQ29sb3I7XG5cbiAgICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLnRvb2x0aXBPdmVybGF5XG4gICAgICAucG9zaXRpb24oKS5nbG9iYWwoKVxuICAgICAgLnRvcChgJHtldmVudC5jbGllbnRZICsgMTV9cHhgKVxuICAgICAgLmxlZnQoYCR7ZXZlbnQuY2xpZW50WCArIDE1fXB4YCk7XG5cbiAgICAgIHRoaXMudG9vbHRpcFJlZiA9IHRoaXMudG9vbHRpcE92ZXJsYXkuY3JlYXRlKHtcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneSxcbiAgICAgICAgaGFzQmFja2Ryb3A6IGZhbHNlLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy50b29sdGlwT3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmNsb3NlKClcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0b29sdGlwQ29tcG9uZW50ID0gdGhpcy50b29sdGlwUmVmLmF0dGFjaCh0aGlzLnRvb2x0aXBQb3J0YWwpO1xuICAgICAgdG9vbHRpcENvbXBvbmVudC5pbnN0YW5jZS50ZXh0ID0gdGlsZS50b29sdGlwVGV4dCA/PyB0aWxlLmlkLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1waXhlbC1ncmlkLXRvb2x0aXAnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtY29udGVudFwiPnt7dGV4dH19PC9kaXY+PC9kaXY+YCxcbiAgc3R5bGVzOiBbYC50b29sdGlwIHsgIGJhY2tncm91bmQtY29sb3I6ICMwMDA7IGNvbG9yOiAjZmZmOyBwYWRkaW5nOiA1cHggMTBweDsgYm9yZGVyLXJhZGl1czogNXB4OyB9YF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRUb29sdGlwQ29tcG9uZW50IHsgQElucHV0KCkgdGV4dCE6IHN0cmluZzsgfVxuIl19