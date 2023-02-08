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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWN2QixNQUFNLE9BQU8scUJBQXFCO0lBRWhDLFlBQ1UsTUFBYyxFQUNkLGdCQUFxQyxFQUNyQyxjQUF1QjtRQUZ2QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUNyQyxtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUd2QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFMUQsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFpQnhCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQW1FbEUscUJBQWdCLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEYsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJ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SCxDQUFDLENBQUMsQ0FBQztRQUNILHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7MEZBNUZVLHFCQUFxQjt3RUFBckIscUJBQXFCOzs7Ozs7OztRQU5oQyxpQ0FBb0U7UUFDbEUsa0NBQWtDO1FBQ3BDLGlCQUFNOzt1RkFJSyxxQkFBcUI7Y0FUakMsU0FBUzsyQkFDRSxnQkFBZ0IsWUFDaEI7OztTQUdILG1CQUVVLHVCQUF1QixDQUFDLE1BQU07aUhBVXJDLFNBQVM7a0JBQWxCLE1BQU07WUFHTSxNQUFNO2tCQUFsQixLQUFLO1lBUWtDLHlCQUF5QjtrQkFBaEUsU0FBUzttQkFBQywyQkFBMkI7WUFDUixlQUFlO2tCQUE1QyxTQUFTO21CQUFDLGlCQUFpQjs7QUF3STlCLE1BQU0sT0FBTyw0QkFBNEI7O3dHQUE1Qiw0QkFBNEI7K0VBQTVCLDRCQUE0QjtRQUo1Qiw4QkFBcUIsYUFBQTtRQUE2QixZQUFRO1FBQUEsaUJBQU0sRUFBQTs7UUFBZCxlQUFRO1FBQVIsOEJBQVE7O3VGQUkxRCw0QkFBNEI7Y0FOeEMsU0FBUzsyQkFDRSx3QkFBd0IsWUFDeEIsd0VBQXdFLGlCQUVuRSxpQkFBaUIsQ0FBQyxTQUFTO2dCQUVTLElBQUk7a0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGl4ZWxHcmlkIH0gZnJvbSAnLi9jbGFzc2VzL3BpeGVsLWdyaWQnO1xuaW1wb3J0IHsgSVRpbGUsIElUaWxlQ2xpY2tFdmVudCB9IGZyb20gJy4vaW50ZXJmYWNlcy9uZ3gtcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBOZ3hQaXhlbEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtcGl4ZWwtZ3JpZC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXBpeGVsLWdyaWQnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2ICNwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyIGNsYXNzPVwicGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyXCI+XG4gICAgPGNhbnZhcyAjcGl4ZWxHcmlkQ2FudmFzPjwvY2FudmFzPlxuICA8L2Rpdj5gLFxuICBzdHlsZXM6IFsnLnBpeGVsLWdyaWQtY2FudmFzLWNvbnRhaW5lciB7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IH0nXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHBpeGVsR3JpZFNlcnZpY2U6IE5neFBpeGVsR3JpZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b29sdGlwT3ZlcmxheTogT3ZlcmxheVxuICApIHsgfVxuICBcbiAgQE91dHB1dCgpIHRpbGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SVRpbGVDbGlja0V2ZW50PigpO1xuXG4gIGhhc0xvYWRlZFBpeGVscyA9IGZhbHNlO1xuICBASW5wdXQoKSBzZXQgcGl4ZWxzKHRpbGVzOiBJVGlsZVtdKSB7XG4gICAgaWYgKCF0aWxlcyB8fCAhdGlsZXMubGVuZ3RoKSByZXR1cm47XG4gICAgdGhpcy5oYXNMb2FkZWRQaXhlbHMgPSB0cnVlO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLnRpbGVzTWF0cml4ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLm1lcmdlVGlsZXNNYXRyaXgodGhpcy50aWxlc01hdHJpeCwgdGlsZXMpO1xuICAgIH0pO1xuICB9XG5cbiAgQFZpZXdDaGlsZCgncGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lcicpIHBpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncGl4ZWxHcmlkQ2FudmFzJykgcGl4ZWxHcmlkQ2FudmFzITogRWxlbWVudFJlZjxIVE1MQ2FudmFzRWxlbWVudD47XG5cbiAgY3R4ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwaXhlbEdyaWQhOiBQaXhlbEdyaWQ7XG4gIHRpbGVzTWF0cml4ITogSVRpbGVbXVtdO1xuXG4gIHRvb2x0aXBSZWYhOiBPdmVybGF5UmVmO1xuICB0b29sdGlwUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChOZ3hQaXhlbEdyaWRUb29sdGlwQ29tcG9uZW50KTtcblxuICBuZ09uSW5pdCgpOiB2b2lkIHsgICAgXG4gICAgY29uc3QgeyBwaXhlbEdyaWQsIHRpbGVzTWF0cml4IH0gPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuYnVpbGRUaWxlc01hdHJpeCgpO1xuICAgIHRoaXMucGl4ZWxHcmlkID0gcGl4ZWxHcmlkO1xuICAgIHRoaXMudGlsZXNNYXRyaXggPSB0aWxlc01hdHJpeDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuY3R4ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmNyZWF0ZUN0eCh0aGlzLnRpbGVzTWF0cml4LCBjYW52YXMpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlTW91c2VDbGljayk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLmhhbmRsZU1vdXNlT3V0KTtcbiAgICBcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpKTtcbiAgfVxuICBcblxuICAvLyB0aW1lRGVsdGEgPSAwLjAwNSAqIC4wNTtcbiAgLy8gdGltZSA9IDA7XG4gIC8vIHN3aXRjaExheW91dCA9IHRydWU7XG4gIGxvb3AodGltZXN0YW1wOiBudW1iZXIpOiB2b2lkIHtcbiAgICBcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC53aWR0aCwgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQpO1xuICAgIC8vIHRoaXMudGltZSArPSB0aGlzLnRpbWVEZWx0YTtcbiAgICAvLyB0aGlzLnRpbWUgKz0gKE1hdGguc2luKHRoaXMudGltZSkgPCAwID8gLjMgOiBNYXRoLmNvcyh0aGlzLnRpbWUpID4gMC41ID8gMC4zIDogMC44KSAqIHRoaXMudGltZURlbHRhO1xuICAgIFxuICAgIC8vIGlmICh0aGlzLnRpbWUgPiAxKSB7XG4gICAgLy8gICB0aGlzLnRpbWUgPSAwO1xuICAgIC8vICAgLy8gdGhpcy5zd2l0Y2hMYXlvdXQgPSAhdGhpcy5zd2l0Y2hMYXlvdXQ7XG4gICAgLy8gfVxuICAgICAgXG4gICAgLy8gdGhpcy5waXhlbEdyaWQudGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAvLyAgIHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueCA9IHRpbGUuY29vcmRpbmF0ZXMueDtcbiAgICAvLyAgIHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueSA9IHRpbGUuY29vcmRpbmF0ZXMueTtcbiAgICAvLyB9KTtcblxuXG4gICAgLy8gbGV0IHRpbGVzID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmdyaWRMYXlvdXQodGhpcy5waXhlbEdyaWQudGlsZXMpO1xuICAgIC8vIGxldCB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkLnRpbGVzO1xuICAgIC8vIGlmKHRoaXMuaGFzTG9hZGVkUGl4ZWxzKSB7XG4gICAgLy8gICB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5ncmlkTGF5b3V0KHRoaXMucGl4ZWxHcmlkLnRpbGVzKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgdGlsZXMgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UucGh5bGxvdGF4aXNMYXlvdXQoXG4gICAgLy8gICAgIHRoaXMucGl4ZWxHcmlkLnRpbGVzLFxuICAgIC8vICAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoICogLjUsXG4gICAgLy8gICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ICogLjVcbiAgICAvLyAgICk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5waXhlbEdyaWQudGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAvLyB0aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgLy8gdGlsZS50YXJnZXRDb29yZGluYXRlcy54ID0gdGlsZS5jb29yZGluYXRlcy54O1xuICAgICAgLy8gdGlsZS50YXJnZXRDb29yZGluYXRlcy55ID0gdGlsZS5jb29yZGluYXRlcy55O1xuICAgICAgLy8gdGlsZS5jb29yZGluYXRlcy54ID0gdGlsZS5zb3VyY2VDb29yZGluYXRlcy54ICogKDEgLSB0aGlzLnRpbWUpICsgdGlsZS50YXJnZXRDb29yZGluYXRlcy54ICogdGhpcy50aW1lO1xuICAgICAgLy8gdGlsZS5jb29yZGluYXRlcy55ID0gdGlsZS5zb3VyY2VDb29yZGluYXRlcy55ICogKDEgLSB0aGlzLnRpbWUpICsgdGlsZS50YXJnZXRDb29yZGluYXRlcy55ICogdGhpcy50aW1lO1xuICAgICAgaWYgKHRpbGUuaXNQaXhlbCkge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGlsZS5pbWchLCB0aWxlLmNvb3JkaW5hdGVzLngsIHRpbGUuY29vcmRpbmF0ZXMueSwgdGlsZS5zaXplLndpZHRoICsgMSwgdGlsZS5zaXplLmhlaWdodCArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGlsZS5jb2xvcjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QodGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCwgdGlsZS5zaXplLmhlaWdodCk7XG4gICAgICB9XG4gICAgfSk7ICAgXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLndoYXRUaWxlSXNNb3VzZU92ZXIodGhpcy50aWxlc01hdHJpeCwgcmVjdCwgZXZlbnQpO1xuICAgIHRpbGUgJiYgdGhpcy50aWxlQ2xpY2suZW1pdCh7IGlkOiB0aWxlLmlkLCBocmVmOiB0aWxlLmhyZWYgPz8gdW5kZWZpbmVkIH0pO1xuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uub3B0aW9ucy50aWxlQ29sb3I7XG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnRvb2x0aXBSZWYuZGlzcG9zZT8uKCk7XG4gIH1cblxuICBjdXJyZW50VGlsZUJlaW5nSG92ZXJlZDogSVRpbGUgfCB1bmRlZmluZWQ7XG4gIGhhbmRsZU1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uud2hhdFRpbGVJc01vdXNlT3Zlcih0aGlzLnRpbGVzTWF0cml4LCByZWN0LCBldmVudCk7XG4gICAgaWYgKHRpbGUpIHtcbiAgICAgIC8vIEtpbmQgb2YgdHJpY2t5IGhlcmUsIHdhbnQgdG8gbGVhdmUgY29tbWVudCBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgLy8gV2UgYXJlIGp1c3QgdHJ5aW5nIHRvIHN3YXAgb3V0IGNvbG9ycyBvZiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb25cbiAgICAgIC8vIFNvIGEgcmVmZXJuY2UgaXMgbWFkZSB0byB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24gYW5kIHRoZSBjb2xvciBpcyBjaGFuZ2VkXG4gICAgICAvLyBJZiB0aGUgdGlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBob3ZlcmVkIG9uIGlzIHRoZSBzYW1lIGFzIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiwgcmV0dXJuXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkID09PSB0aWxlLmlkKSByZXR1cm47XG4gICAgICAvLyBJZiB0aGUgdG9vbHRpcCBpcyBvcGVuLCBjbG9zZSBpdFxuICAgICAgLy8gIUBUT0RPIC0gU2hvdWxkIG9ubHkgZGV0YWNoIGlmIHRoZSBuZXcgdGlsZSBpcyBvbiBzYW1lIHRpbGUgZ3JvdXAgYXMgdGhlIGxhc3RcbiAgICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kZXRhY2goKTtcbiAgICAgIC8vIElmIHRoZSB0aWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGhvdmVyZWQgb24gaXMgZGlmZmVyZW50IHRoYW4gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uLCBcbiAgICAgIC8vIHdlIG5lZWQgdG8gY2hhbmdlIHRoZSBjb2xvciBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjb2xvclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgJiYgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5pZCAhPT0gdGlsZS5pZCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSByZWZlcmVuY2UgdG8gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkID0gdGlsZTtcblxuICAgICAgLy8gQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24gdG8gdGhlIGhvdmVyIGNvbG9yXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5ob3ZlckNvbG9yO1xuXG4gICAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy50b29sdGlwT3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKCkuZ2xvYmFsKClcbiAgICAgIC50b3AoYCR7ZXZlbnQuY2xpZW50WSArIDE1fXB4YClcbiAgICAgIC5sZWZ0KGAke2V2ZW50LmNsaWVudFggKyAxNX1weGApO1xuXG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSB0aGlzLnRvb2x0aXBPdmVybGF5LmNyZWF0ZSh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3ksXG4gICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMudG9vbHRpcE92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5jbG9zZSgpXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdG9vbHRpcENvbXBvbmVudCA9IHRoaXMudG9vbHRpcFJlZi5hdHRhY2godGhpcy50b29sdGlwUG9ydGFsKTtcbiAgICAgIHRvb2x0aXBDb21wb25lbnQuaW5zdGFuY2UudGV4dCA9IHRpbGUudG9vbHRpcFRleHQgPz8gdGlsZS5pZC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZC10b29sdGlwJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRlbnRcIj57e3RleHR9fTwvZGl2PjwvZGl2PmAsXG4gIHN0eWxlczogW2AudG9vbHRpcCB7ICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwOyBjb2xvcjogI2ZmZjsgcGFkZGluZzogNXB4IDEwcHg7IGJvcmRlci1yYWRpdXM6IDVweDsgfWBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCB7IEBJbnB1dCgpIHRleHQhOiBzdHJpbmc7IH1cbiJdfQ==