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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWN2QixNQUFNLE9BQU8scUJBQXFCO0lBRWhDLFlBQ1UsTUFBYyxFQUNkLGdCQUFxQyxFQUNyQyxjQUF1QjtRQUZ2QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUNyQyxtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUd2QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFMUQsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFpQnhCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQW1CbEUsY0FBUyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDeEIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQTZDVCxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3hFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0RixJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQTtRQUVELG1CQUFjLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO2dCQUNoQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUM3RSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsU0FBUyxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUdELG9CQUFlLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEYsSUFBSSxJQUFJLEVBQUU7Z0JBQ1Isa0VBQWtFO2dCQUNsRSx1RUFBdUU7Z0JBQ3ZFLGdGQUFnRjtnQkFDaEYsb0dBQW9HO2dCQUNwRyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFO29CQUFFLE9BQU87Z0JBQ3hGLG1DQUFtQztnQkFDbkMsZ0ZBQWdGO2dCQUNoRixJQUFJLElBQUksQ0FBQyxVQUFVO29CQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzlDLGlHQUFpRztnQkFDakcseURBQXlEO2dCQUN6RCxJQUFJLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7b0JBQy9FLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDakQ7Z0JBRUQsbURBQW1EO2dCQUNuRCxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO2dCQUVwQyxxRUFBcUU7Z0JBQ3JFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFFckQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsY0FBYztxQkFDM0MsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFO3FCQUNuQixHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxDQUFDO3FCQUM5QixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRWpDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7b0JBQzNDLGdCQUFnQjtvQkFDaEIsV0FBVyxFQUFFLEtBQUs7b0JBQ2xCLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRTtpQkFDN0QsQ0FBQyxDQUFDO2dCQUVILE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUN6RTtRQUNILENBQUMsQ0FBQTtJQTNJRyxDQUFDO0lBS0wsSUFBYSxNQUFNLENBQUMsS0FBYztRQUNoQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07WUFBRSxPQUFPO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkYscUJBQXFCLENBQUMsR0FBRyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVlELFFBQVE7UUFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzVFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxlQUFlO1FBQ2IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUM7UUFDbEQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBS0QsdUJBQXVCO0lBQ3ZCLElBQUksQ0FBQyxTQUFpQjtRQUVwQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RywrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRXRHLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDZCwwQ0FBMEM7U0FDM0M7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBRyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3ZCLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDaEU7YUFBTTtZQUNMLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUM3QyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUMvQyxDQUFBO1NBQ0Y7UUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdkcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDbEg7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM5RjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDOzswRkExRlUscUJBQXFCO3dFQUFyQixxQkFBcUI7Ozs7Ozs7O1FBTmhDLGlDQUFvRTtRQUNsRSxrQ0FBa0M7UUFDcEMsaUJBQU07O3VGQUlLLHFCQUFxQjtjQVRqQyxTQUFTOzJCQUNFLGdCQUFnQixZQUNoQjs7O1NBR0gsbUJBRVUsdUJBQXVCLENBQUMsTUFBTTtpSEFVckMsU0FBUztrQkFBbEIsTUFBTTtZQUdNLE1BQU07a0JBQWxCLEtBQUs7WUFRa0MseUJBQXlCO2tCQUFoRSxTQUFTO21CQUFDLDJCQUEyQjtZQUNSLGVBQWU7a0JBQTVDLFNBQVM7bUJBQUMsaUJBQWlCOztBQXNJOUIsTUFBTSxPQUFPLDRCQUE0Qjs7d0dBQTVCLDRCQUE0QjsrRUFBNUIsNEJBQTRCO1FBSjVCLDhCQUFxQixhQUFBO1FBQTZCLFlBQVE7UUFBQSxpQkFBTSxFQUFBOztRQUFkLGVBQVE7UUFBUiw4QkFBUTs7dUZBSTFELDRCQUE0QjtjQU54QyxTQUFTOzJCQUNFLHdCQUF3QixZQUN4Qix3RUFBd0UsaUJBRW5FLGlCQUFpQixDQUFDLFNBQVM7Z0JBRVMsSUFBSTtrQkFBWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQaXhlbEdyaWQgfSBmcm9tICcuL2NsYXNzZXMvcGl4ZWwtZ3JpZCc7XG5pbXBvcnQgeyBJVGlsZSwgSVRpbGVDbGlja0V2ZW50IH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcbmltcG9ydCB7IE5neFBpeGVsR3JpZFNlcnZpY2UgfSBmcm9tICcuL25neC1waXhlbC1ncmlkLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZCcsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIgY2xhc3M9XCJwaXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXJcIj5cbiAgICA8Y2FudmFzICNwaXhlbEdyaWRDYW52YXM+PC9jYW52YXM+XG4gIDwvZGl2PmAsXG4gIHN0eWxlczogWycucGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgfSddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGl4ZWxHcmlkU2VydmljZTogTmd4UGl4ZWxHcmlkU2VydmljZSxcbiAgICBwcml2YXRlIHRvb2x0aXBPdmVybGF5OiBPdmVybGF5XG4gICkgeyB9XG4gIFxuICBAT3V0cHV0KCkgdGlsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxJVGlsZUNsaWNrRXZlbnQ+KCk7XG5cbiAgaGFzTG9hZGVkUGl4ZWxzID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNldCBwaXhlbHModGlsZXM6IElUaWxlW10pIHtcbiAgICBpZiAoIXRpbGVzIHx8ICF0aWxlcy5sZW5ndGgpIHJldHVybjtcbiAgICB0aGlzLnRpbGVzTWF0cml4ID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLm1lcmdlVGlsZXNNYXRyaXgodGhpcy50aWxlc01hdHJpeCwgdGlsZXMpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLmhhc0xvYWRlZFBpeGVscyA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyJykgcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXMnKSBwaXhlbEdyaWRDYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBjdHghOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHBpeGVsR3JpZCE6IFBpeGVsR3JpZDtcbiAgdGlsZXNNYXRyaXghOiBJVGlsZVtdW107XG5cbiAgdG9vbHRpcFJlZiE6IE92ZXJsYXlSZWY7XG4gIHRvb2x0aXBQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQpO1xuXG4gIG5nT25Jbml0KCk6IHZvaWQgeyAgICBcbiAgICBjb25zdCB7IHBpeGVsR3JpZCwgdGlsZXNNYXRyaXggfSA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5idWlsZFRpbGVzTWF0cml4KCk7XG4gICAgdGhpcy5waXhlbEdyaWQgPSBwaXhlbEdyaWQ7XG4gICAgdGhpcy50aWxlc01hdHJpeCA9IHRpbGVzTWF0cml4O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5jdHggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuY3JlYXRlQ3R4KHRoaXMudGlsZXNNYXRyaXgsIGNhbnZhcyk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVNb3VzZUNsaWNrKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVNb3VzZU1vdmUpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMuaGFuZGxlTW91c2VPdXQpO1xuICAgIFxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSkpO1xuICB9XG4gIFxuXG4gIHRpbWVEZWx0YSA9IDAuMDA1ICogLjA1O1xuICB0aW1lID0gMDtcbiAgLy8gc3dpdGNoTGF5b3V0ID0gdHJ1ZTtcbiAgbG9vcCh0aW1lc3RhbXA6IG51bWJlcik6IHZvaWQge1xuICAgIFxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoLCB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCk7XG4gICAgLy8gdGhpcy50aW1lICs9IHRoaXMudGltZURlbHRhO1xuICAgIHRoaXMudGltZSArPSAoTWF0aC5zaW4odGhpcy50aW1lKSA8IDAgPyAuMyA6IC1NYXRoLmNvcyh0aGlzLnRpbWUpID4gMC41ID8gMC4zIDogMC44KSAqIHRoaXMudGltZURlbHRhO1xuICAgIFxuICAgIGlmICh0aGlzLnRpbWUgPiAxKSB7XG4gICAgICB0aGlzLnRpbWUgPSAwO1xuICAgICAgLy8gdGhpcy5zd2l0Y2hMYXlvdXQgPSAhdGhpcy5zd2l0Y2hMYXlvdXQ7XG4gICAgfVxuICAgICAgXG4gICAgdGhpcy5waXhlbEdyaWQudGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgIHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueCA9IHRpbGUuY29vcmRpbmF0ZXMueDtcbiAgICAgIHRpbGUuc291cmNlQ29vcmRpbmF0ZXMueSA9IHRpbGUuY29vcmRpbmF0ZXMueTtcbiAgICB9KTtcblxuXG4gICAgbGV0IHRpbGVzID0gdGhpcy5waXhlbEdyaWQudGlsZXM7XG4gICAgaWYodGhpcy5oYXNMb2FkZWRQaXhlbHMpIHtcbiAgICAgIHRpbGVzID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmdyaWRMYXlvdXQodGhpcy5waXhlbEdyaWQudGlsZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aWxlcyA9IHRoaXMucGl4ZWxHcmlkU2VydmljZS5waHlsbG90YXhpc0xheW91dChcbiAgICAgICAgdGhpcy5waXhlbEdyaWQudGlsZXMsXG4gICAgICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggKiAuNSxcbiAgICAgICAgdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5oZWlnaHQgKiAuNVxuICAgICAgKSBcbiAgICB9XG5cbiAgICB0aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgdGlsZS50YXJnZXRDb29yZGluYXRlcy54ID0gdGlsZS5jb29yZGluYXRlcy54O1xuICAgICAgdGlsZS50YXJnZXRDb29yZGluYXRlcy55ID0gdGlsZS5jb29yZGluYXRlcy55O1xuICAgICAgdGlsZS5jb29yZGluYXRlcy54ID0gdGlsZS5zb3VyY2VDb29yZGluYXRlcy54ICogKDEgLSB0aGlzLnRpbWUpICsgdGlsZS50YXJnZXRDb29yZGluYXRlcy54ICogdGhpcy50aW1lO1xuICAgICAgdGlsZS5jb29yZGluYXRlcy55ID0gdGlsZS5zb3VyY2VDb29yZGluYXRlcy55ICogKDEgLSB0aGlzLnRpbWUpICsgdGlsZS50YXJnZXRDb29yZGluYXRlcy55ICogdGhpcy50aW1lO1xuICAgICAgaWYgKHRpbGUuaXNQaXhlbCkge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGlsZS5pbWchLCB0aWxlLmNvb3JkaW5hdGVzLngsIHRpbGUuY29vcmRpbmF0ZXMueSwgdGlsZS5zaXplLndpZHRoICsgMSwgdGlsZS5zaXplLmhlaWdodCArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGlsZS5jb2xvcjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QodGlsZS5jb29yZGluYXRlcy54LCB0aWxlLmNvb3JkaW5hdGVzLnksIHRpbGUuc2l6ZS53aWR0aCwgdGlsZS5zaXplLmhlaWdodCk7XG4gICAgICB9XG4gICAgfSk7ICAgXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRTZXJ2aWNlLndoYXRUaWxlSXNNb3VzZU92ZXIodGhpcy50aWxlc01hdHJpeCwgcmVjdCwgZXZlbnQpO1xuICAgIHRpbGUgJiYgdGhpcy50aWxlQ2xpY2suZW1pdCh7IGlkOiB0aWxlLmlkLCBocmVmOiB0aWxlLmhyZWYgPz8gdW5kZWZpbmVkIH0pO1xuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uub3B0aW9ucy50aWxlQ29sb3I7XG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnRvb2x0aXBSZWYuZGlzcG9zZT8uKCk7XG4gIH1cblxuICBjdXJyZW50VGlsZUJlaW5nSG92ZXJlZDogSVRpbGUgfCB1bmRlZmluZWQ7XG4gIGhhbmRsZU1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2Uud2hhdFRpbGVJc01vdXNlT3Zlcih0aGlzLnRpbGVzTWF0cml4LCByZWN0LCBldmVudCk7XG4gICAgaWYgKHRpbGUpIHtcbiAgICAgIC8vIEtpbmQgb2YgdHJpY2t5IGhlcmUsIHdhbnQgdG8gbGVhdmUgY29tbWVudCBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgLy8gV2UgYXJlIGp1c3QgdHJ5aW5nIHRvIHN3YXAgb3V0IGNvbG9ycyBvZiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb25cbiAgICAgIC8vIFNvIGEgcmVmZXJuY2UgaXMgbWFkZSB0byB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24gYW5kIHRoZSBjb2xvciBpcyBjaGFuZ2VkXG4gICAgICAvLyBJZiB0aGUgdGlsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBob3ZlcmVkIG9uIGlzIHRoZSBzYW1lIGFzIHRoZSB0aWxlIHdlIGFyZSBob3ZlcmluZyBvbiwgcmV0dXJuXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkID09PSB0aWxlLmlkKSByZXR1cm47XG4gICAgICAvLyBJZiB0aGUgdG9vbHRpcCBpcyBvcGVuLCBjbG9zZSBpdFxuICAgICAgLy8gIUBUT0RPIC0gU2hvdWxkIG9ubHkgZGV0YWNoIGlmIHRoZSBuZXcgdGlsZSBpcyBvbiBzYW1lIHRpbGUgZ3JvdXAgYXMgdGhlIGxhc3RcbiAgICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kZXRhY2goKTtcbiAgICAgIC8vIElmIHRoZSB0aWxlIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGhvdmVyZWQgb24gaXMgZGlmZmVyZW50IHRoYW4gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uLCBcbiAgICAgIC8vIHdlIG5lZWQgdG8gY2hhbmdlIHRoZSBjb2xvciBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjb2xvclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQgJiYgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZC5pZCAhPT0gdGlsZS5pZCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSByZWZlcmVuY2UgdG8gdGhlIHRpbGUgd2UgYXJlIGhvdmVyaW5nIG9uXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkID0gdGlsZTtcblxuICAgICAgLy8gQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgdGlsZSB3ZSBhcmUgaG92ZXJpbmcgb24gdG8gdGhlIGhvdmVyIGNvbG9yXG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5ob3ZlckNvbG9yO1xuXG4gICAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy50b29sdGlwT3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKCkuZ2xvYmFsKClcbiAgICAgIC50b3AoYCR7ZXZlbnQuY2xpZW50WSArIDE1fXB4YClcbiAgICAgIC5sZWZ0KGAke2V2ZW50LmNsaWVudFggKyAxNX1weGApO1xuXG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSB0aGlzLnRvb2x0aXBPdmVybGF5LmNyZWF0ZSh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3ksXG4gICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMudG9vbHRpcE92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5jbG9zZSgpXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdG9vbHRpcENvbXBvbmVudCA9IHRoaXMudG9vbHRpcFJlZi5hdHRhY2godGhpcy50b29sdGlwUG9ydGFsKTtcbiAgICAgIHRvb2x0aXBDb21wb25lbnQuaW5zdGFuY2UudGV4dCA9IHRpbGUudG9vbHRpcFRleHQgPz8gdGlsZS5pZC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZC10b29sdGlwJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRlbnRcIj57e3RleHR9fTwvZGl2PjwvZGl2PmAsXG4gIHN0eWxlczogW2AudG9vbHRpcCB7ICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwOyBjb2xvcjogI2ZmZjsgcGFkZGluZzogNXB4IDEwcHg7IGJvcmRlci1yYWRpdXM6IDVweDsgfWBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCB7IEBJbnB1dCgpIHRleHQhOiBzdHJpbmc7IH1cbiJdfQ==