import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-pixel-grid.service";
import * as i2 from "@angular/cdk/overlay";
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
NgxPixelGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridComponent, deps: [{ token: i0.NgZone }, { token: i1.NgxPixelGridService }, { token: i2.Overlay }], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridComponent, selector: "ngx-pixel-grid", inputs: { pixels: "pixels" }, outputs: { tileClick: "tileClick" }, host: { listeners: { "window:resize": "onResize()" } }, viewQueries: [{ propertyName: "pixelGridCanvasContatiner", first: true, predicate: ["pixelGridCanvasContatiner"], descendants: true }, { propertyName: "pixelGridCanvas", first: true, predicate: ["pixelGridCanvas"], descendants: true }], ngImport: i0, template: `
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
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
export class NgxPixelGridTooltipComponent {
}
NgxPixelGridTooltipComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridTooltipComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridTooltipComponent, selector: "ngx-pixel-grid-tooltip", inputs: { text: "text" }, ngImport: i0, template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, isInline: true, styles: [":host,.tooltip{pointer-events:none}.tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pixel-grid-tooltip', template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, styles: [":host,.tooltip{pointer-events:none}.tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] }]
        }], propDecorators: { text: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWdyaWQvc3JjL2xpYi9uZ3gtcGl4ZWwtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7O0FBYWpELE1BQU0sT0FBTyxxQkFBcUI7SUFFaEMsWUFDVSxNQUFjLEVBQ2QsZ0JBQXFDLEVBQ3JDLGNBQXVCO1FBRnZCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXFCO1FBQ3JDLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBR3ZCLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQTBGMUQscUJBQWdCLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLElBQUksSUFBSTtnQkFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFBO1FBR0Qsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQ2xFLG9CQUFlLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDdEMsTUFBTSxJ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Q3RFLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUM7aUJBQ25CO2FBQ0o7U0FDRjtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7O21IQWhHVSxxQkFBcUI7dUdBQXJCLHFCQUFxQiw4WkFQdEI7OztTQUdIOzRGQUlJLHFCQUFxQjtrQkFUakMsU0FBUzsrQkFDRSxnQkFBZ0IsWUFDaEI7OztTQUdILG1CQUVVLHVCQUF1QixDQUFDLE1BQU07cUpBVXJDLFNBQVM7c0JBQWxCLE1BQU07Z0JBRU0sTUFBTTtzQkFBbEIsS0FBSztnQkFRa0MseUJBQXlCO3NCQUFoRSxTQUFTO3VCQUFDLDJCQUEyQjtnQkFDUixlQUFlO3NCQUE1QyxTQUFTO3VCQUFDLGlCQUFpQjtnQkFTNUIsUUFBUTtzQkFEUCxZQUFZO3VCQUFDLGVBQWU7O0FBa0kvQixNQUFNLE9BQU8sNEJBQTRCOzswSEFBNUIsNEJBQTRCOzhHQUE1Qiw0QkFBNEIsd0ZBWDdCLHdFQUF3RTs0RkFXdkUsNEJBQTRCO2tCQWJ4QyxTQUFTOytCQUNFLHdCQUF3QixZQUN4Qix3RUFBd0U7OEJBWXpFLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBpeGVsR3JpZCB9IGZyb20gJy4vY2xhc3Nlcy9waXhlbC1ncmlkJztcbmltcG9ydCB7IElTaXplLCBJVGlsZSwgSVRpbGVDbGlja0V2ZW50IH0gZnJvbSAnLi9pbnRlcmZhY2VzL25neC1waXhlbC1ncmlkJztcbmltcG9ydCB7IE5neFBpeGVsR3JpZFNlcnZpY2UgfSBmcm9tICcuL25neC1waXhlbC1ncmlkLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZCcsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI3BpeGVsR3JpZENhbnZhc0NvbnRhdGluZXIgY2xhc3M9XCJwaXhlbC1ncmlkLWNhbnZhcy1jb250YWluZXJcIj5cbiAgICA8Y2FudmFzICNwaXhlbEdyaWRDYW52YXM+PC9jYW52YXM+XG4gIDwvZGl2PmAsXG4gIHN0eWxlczogWycucGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgfSddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGl4ZWxHcmlkU2VydmljZTogTmd4UGl4ZWxHcmlkU2VydmljZSxcbiAgICBwcml2YXRlIHRvb2x0aXBPdmVybGF5OiBPdmVybGF5XG4gICkgeyB9XG4gIFxuICBAT3V0cHV0KCkgdGlsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxJVGlsZUNsaWNrRXZlbnQ+KCk7XG5cbiAgQElucHV0KCkgc2V0IHBpeGVscyh0aWxlczogSVRpbGVbXSkge1xuICAgIGlmICghdGlsZXMgfHwgIXRpbGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXggPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UubWVyZ2VUaWxlc01hdHJpeChcbiAgICAgIHRoaXMucGl4ZWxHcmlkVGlsZXNNYXRyaXgsXG4gICAgICB0aWxlc1xuICAgICk7XG4gIH1cblxuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXNDb250YXRpbmVyJykgcGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lciE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwaXhlbEdyaWRDYW52YXMnKSBwaXhlbEdyaWRDYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcblxuICBjdHghOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHBpeGVsR3JpZCE6IFBpeGVsR3JpZDtcbiAgcGl4ZWxHcmlkVGlsZXNNYXRyaXghOiBJVGlsZVtdW107XG5cbiAgdG9vbHRpcFJlZiE6IE92ZXJsYXlSZWY7XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uUmVzaXplKCkge1xuICAgIGNvbnN0IHBpeGVsR3JpZFNpemUgPSB0aGlzLmdldFBpeGVsR3JpZFNpemUodGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeCwgdGhpcy5waXhlbEdyaWQuZ3V0dGVyKTtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gcGl4ZWxHcmlkU2l6ZS53aWR0aDtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IHBpeGVsR3JpZFNpemUuaGVpZ2h0O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY3R4ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpITtcblxuICAgIHRoaXMucGl4ZWxHcmlkQ2FudmFzQ29udGF0aW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVNb3VzZUNsaWNrKTtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuaGFuZGxlTW91c2VNb3ZlKTtcbiAgICB0aGlzLnBpeGVsR3JpZENhbnZhcy5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5oYW5kbGVNb3VzZU91dCk7XG5cbiAgICB0aGlzLnBpeGVsR3JpZCA9IG5ldyBQaXhlbEdyaWQoXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UuY29sdW1ucyxcbiAgICAgIHRoaXMucGl4ZWxHcmlkU2VydmljZS5yb3dzLFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLmd1dHRlclxuICAgICk7XG4gICAgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeCA9IHRoaXMucGl4ZWxHcmlkLmJ1aWxkVGlsZXNNYXRyaXgoXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UudGlsZVNpemUsXG4gICAgICB0aGlzLnBpeGVsR3JpZFNlcnZpY2UudGlsZUNvbG9yLFxuICAgICAgdGhpcy5waXhlbEdyaWRTZXJ2aWNlLnRpbGVIb3ZlckNvbG9yXG4gICAgKTtcblxuICAgIHRoaXMub25SZXNpemUoKTtcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLmxvb3AoKSk7XG4gIH1cbiAgXG4gIGxvb3AoKSB7XG4gICAgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeC5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICByb3cuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgICAgLy8gSWYgdGhlIHRpbGUgaXMgYSBwaXhlbCwgdGhlbiBwYWludCBiYXNlNjQgaW1hZ2UgdG8gdGhlIGN0eFxuICAgICAgICBpZiAodGlsZS5pc1BpeGVsKSB7XG4gICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgaW1nLnNyYyA9IHRpbGUuaW1nITtcbiAgICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCB0aWxlLmNvb3JkaW5hdGVzLngsIHRpbGUuY29vcmRpbmF0ZXMueSwgdGlsZS5zaXplLndpZHRoICsgMSwgdGlsZS5zaXplLmhlaWdodCArIDEpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aWxlLmNvbG9yO1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHRpbGUuY29vcmRpbmF0ZXMueCwgdGlsZS5jb29yZGluYXRlcy55LCB0aWxlLnNpemUud2lkdGgsIHRpbGUuc2l6ZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5sb29wKCkpO1xuICB9XG5cbiAgZ2V0UGl4ZWxHcmlkU2l6ZShwaXhlbEdyaWRUaWxlc01hdHJpeDogSVRpbGVbXVtdLCBndXR0ZXI6IG51bWJlcik6IElTaXplIHtcbiAgICBjb25zdCB3aWR0aCA9IHBpeGVsR3JpZFRpbGVzTWF0cml4WzBdLmxlbmd0aCAqIHBpeGVsR3JpZFRpbGVzTWF0cml4WzBdWzBdLnNpemUud2lkdGggKyAocGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF0ubGVuZ3RoIC0gMSkgKiBndXR0ZXI7XG4gICAgY29uc3QgaGVpZ2h0ID0gcGl4ZWxHcmlkVGlsZXNNYXRyaXgubGVuZ3RoICogcGl4ZWxHcmlkVGlsZXNNYXRyaXhbMF1bMF0uc2l6ZS5oZWlnaHQgKyAocGl4ZWxHcmlkVGlsZXNNYXRyaXgubGVuZ3RoIC0gMSkgKiBndXR0ZXI7XG4gICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgd2hhdFRpbGVJc01vdXNlT3ZlcihldmVudDogTW91c2VFdmVudCk6IElUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5waXhlbEdyaWRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgIGxldCByZXR1cm5UaWxlID0gdW5kZWZpbmVkO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnBpeGVsR3JpZFRpbGVzTWF0cml4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IobGV0IGogPSAwOyBqIDwgdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5waXhlbEdyaWRUaWxlc01hdHJpeFtpXVtqXTtcbiAgICAgICAgaWYgKHggPj0gdGlsZS5jb29yZGluYXRlcy54ICYmIHggPD0gdGlsZS5jb29yZGluYXRlcy54ICsgdGlsZS5zaXplLndpZHRoICYmXG4gICAgICAgICAgeSA+PSB0aWxlLmNvb3JkaW5hdGVzLnkgJiYgeSA8PSB0aWxlLmNvb3JkaW5hdGVzLnkgKyB0aWxlLnNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm5UaWxlID0gdGlsZTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXR1cm5UaWxlO1xuICB9XG5cbiAgaGFuZGxlTW91c2VDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRpbGUgPSB0aGlzLndoYXRUaWxlSXNNb3VzZU92ZXIoZXZlbnQpO1xuICAgIGlmICh0aWxlKSB0aGlzLnRpbGVDbGljay5lbWl0KHsgaWQ6IHRpbGUuaWQsIGhyZWY6IHRpbGUuaHJlZiA/PyB1bmRlZmluZWQgfSk7XG4gIH1cblxuICBjdXJyZW50VGlsZUJlaW5nSG92ZXJlZDogSVRpbGUgfCB1bmRlZmluZWQ7XG4gIHRvb2x0aXBQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE5neFBpeGVsR3JpZFRvb2x0aXBDb21wb25lbnQpO1xuICBoYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB0aWxlID0gdGhpcy53aGF0VGlsZUlzTW91c2VPdmVyKGV2ZW50KTtcbiAgICBpZiAodGlsZSkge1xuICAgICAgLy8gSWYgdGhlIHRpbGUgaXMgdGhlIHNhbWUgYXMgdGhlIG9uZSBiZWluZyBob3ZlcmVkLCBkbyBub3RoaW5nXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkID09PSB0aWxlLmlkKSByZXR1cm47XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHRpbGUgYmVpbmcgaG92ZXJlZCwgcmVzZXQgaXRzIGNvbG9yXG4gICAgICBpZiAodGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCAmJiB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmlkICE9PSB0aWxlLmlkKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aWxlLmNvbG9yO1xuICAgICAgfVxuICAgICAgLy8gSWYgdGhlcmUgaXMgYSB0b29sdGlwIGJlaW5nIHNob3duLCBkZXN0cm95IGl0XG4gICAgICBpZiAodGhpcy50b29sdGlwUmVmKSB0aGlzLnRvb2x0aXBSZWYuZGV0YWNoKCk7XG4gICAgICBcbiAgICAgIC8vIFNldCB0aGUgbmV3IHRpbGUgYmVpbmcgaG92ZXJlZFxuICAgICAgdGhpcy5jdXJyZW50VGlsZUJlaW5nSG92ZXJlZCA9IHRpbGU7XG4gICAgICB0aGlzLmN1cnJlbnRUaWxlQmVpbmdIb3ZlcmVkLmNvbG9yID0gdGlsZS5ob3ZlckNvbG9yO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIHRvb2x0aXAgc3RyYXRlZ3lcbiAgICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLnRvb2x0aXBPdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCk7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LnRvcChgJHtldmVudC5jbGllbnRZICsgMTV9cHhgKS5sZWZ0KGAke2V2ZW50LmNsaWVudFggKyAxNX1weGApO1xuICAgICAgdGhpcy50b29sdGlwUmVmID0gdGhpcy50b29sdGlwT3ZlcmxheS5jcmVhdGUoe1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5LFxuICAgICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLnRvb2x0aXBPdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpXG4gICAgICB9KTtcblxuICAgICAgLy8gQ3JlYXRlIHRoZSB0b29sdGlwIGNvbXBvbmVudFxuICAgICAgY29uc3QgdG9vbHRpcENvbXBvbmVudCA9IHRoaXMudG9vbHRpcFJlZi5hdHRhY2godGhpcy50b29sdGlwUG9ydGFsKTtcbiAgICAgIHRvb2x0aXBDb21wb25lbnQuaW5zdGFuY2UudGV4dCA9IHRpbGUudG9vbHRpcFRleHQgPz8gdGlsZS5pZC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0ID0gKCkgPT4ge1xuICAgIC8vIENsZWFuIHVwXG4gICAgaWYgKHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQpIHRoaXMuY3VycmVudFRpbGVCZWluZ0hvdmVyZWQuY29sb3IgPSB0aGlzLnBpeGVsR3JpZFNlcnZpY2UudGlsZUNvbG9yO1xuICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHRoaXMudG9vbHRpcFJlZi5kaXNwb3NlKCk7XG4gIH1cbn1cblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtZ3JpZC10b29sdGlwJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRlbnRcIj57e3RleHR9fTwvZGl2PjwvZGl2PmAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCwgLnRvb2x0aXAgeyBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAgIC50b29sdGlwIHsgXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICAgICAgY29sb3I6ICNmZmY7XG4gICAgICBwYWRkaW5nOiA1cHggMTBweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgfVxuICBgXSxcbn0pXG5leHBvcnQgY2xhc3MgTmd4UGl4ZWxHcmlkVG9vbHRpcENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIHRleHQhOiBzdHJpbmc7XG59Il19